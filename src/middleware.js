import { NextResponse } from "next/server";
import { roles } from "./services/helper/helper";

export function middleware(req) {
  const token = req.cookies.get("token");
  const role = req.cookies.get("role")?.value;

  const isProtectedAdminRoute = ["/quan-ly/thong-ke", "/quan-ly/tai-khoan"].includes(req.nextUrl.pathname);
  const isProtectedNotAdminRoute = ["/quan-ly/khach-hang", "/quan-ly/tiep-nhan-bao-hanh", "/quan-ly/ly-do-bao-hanh"].includes(req.nextUrl.pathname);

  if (!token) {
    return NextResponse.redirect(new URL("/dang-nhap", req.url));
  } else {
    if (isProtectedAdminRoute) {
      if (role !== roles.admin) {
        return NextResponse.redirect(new URL("/not-found", req.url));
      }
    } else {
      if (isProtectedNotAdminRoute) {
        if (role === roles.technician) {
          return NextResponse.redirect(new URL("/not-found", req.url));
        }
      }
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/quan-ly/:path*"],
};
