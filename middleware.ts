import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const token = cookies().get("token");

  if (!token) return NextResponse.redirect(new URL("/", request.url));
 console.log("working")
try {
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token.value, secretKey);
  if(!payload){
    if(request.url.includes("/student/dashboard/"))  {
      console.log("payload")
      return NextResponse.redirect(new URL("/student", request.url));
    } else if(request.url.includes("/recruit/dashboard/")){
      return NextResponse.redirect(new URL("/recruit", request.url));
    }
  }
  console.log(payload)
  console.log("payload")
return NextResponse.next();
  // const { role } = payload; 
  // console.log(payload.role)
  //  console.log(request.nextUrl)
  // if (
  //   (request.nextUrl.pathname.startsWith("/student/dashboard/") &&
  //     role === "student") ||
  //   (request.url.includes("/recruit/dashboard/") && role === "recruit")
  // ) {
  //   console.log("sucess");
  //   return NextResponse.next();
  // }
} catch (error) {
    if (request.url.includes("/student/dashboard/")) {
      return NextResponse.redirect(new URL("/student", request.url));

    } else if (request.url.includes("/recruit/dashboard/")) {
      return NextResponse.redirect(new URL("/recruit", request.url));
    }
}
}
export const config = {
  matcher: [      
    "/student/dashboard/:path*",
    "/recruit/dashboard/:path*",
  ],
};
