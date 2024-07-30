import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = cookies().get("token");
    if (!token) return;
    const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token.value, secretKey);

    let user;
    if (payload.role === "recruit") {
      user = {
        name: payload.name,
        profile: payload.profile_url,
        company: payload.company,
      };
    } else if (payload.role === "student") {
      user = {
        name: payload.name,
        id:payload.id
      };
    }
    return new Response(JSON.stringify(user), {
      status: 200,
      statusText: "sucess",
    });
  } catch (error) {
    console.log(error);
  }
}
