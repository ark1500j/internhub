import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/dbclient";

export async function GET(request: NextRequest) {
  try {
    const token = cookies().get("token");
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    let payload;
    try {
      const { payload: verifiedPayload } = await jwtVerify(
        token.value,
        secretKey
      );
      payload = verifiedPayload;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const applications = await prisma.application.findMany({
      where: { applicantId: payload.id as string },
      include: { internship: true },
    });

    if (!applications || applications.length === 0) {
      return NextResponse.json(
        { error: "No applications found" },
        { status: 404 }
      );
    }
    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.redirect(new URL("/student", request.url));
  }
}
