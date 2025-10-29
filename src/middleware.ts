// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken") ?? req.cookies.get("token");
  const url = req.nextUrl.clone();

  if (!accessToken && url.pathname.startsWith("/(dashboard)")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
 matcher: ["/dashboard/:path*"],
};
