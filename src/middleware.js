import { NextResponse } from "next/server";
import cookie from "cookie";

export function middleware(req) {
  // Lấy ra cookie từ yêu cầu
  const token = req.cookies.get("token");
  console.log("MIDDLEWARE")
  console.log(token)
  
  // Kiểm tra xem cookie có chứa thông tin người dùng hay không
  if (!token) {
    // Nếu không, chuyển hướng người dùng đến trang đăng nhập
    return NextResponse.redirect(new URL('/dang-nhap', req.url));
  }

  // Nếu có, cho phép yêu cầu tiếp tục
  return NextResponse.next();
}
export const config = {
  matcher: ['/quan-ly/:path*'],
}
