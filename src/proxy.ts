import { NextResponse, type NextRequest } from "next/server";

const TOKEN_KEY = "sisi_token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath =
    pathname === "/admin" || pathname.startsWith("/admin/");

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get(TOKEN_KEY)?.value;

  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
