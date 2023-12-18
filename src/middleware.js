import { NextResponse } from "next/server";
import cookie from "cookie";

export function middleware(req) {
  const token = req.cookies.get("token");
  // console.log("MIDDLEWARE")
  // console.log(token)
  
  if (!token) {
    return NextResponse.redirect(new URL('/dang-nhap', req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/quan-ly/:path*'],
}
