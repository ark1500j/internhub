import { prisma } from "@/utils/dbclient";

export async function GET(request: Request) {
  try {
    const data = await prisma.internship.findMany({});
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const { id } = await request.json();
  try {
    const internship = await prisma.internship.findFirst({
      where: { id },
      include: {
        representative: { select: { company: true } },
      },
    });
    return Response.json(internship);
  } catch (error) {}
}
