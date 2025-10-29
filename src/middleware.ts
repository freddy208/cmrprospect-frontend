// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  console.log('🔒 ==================== MIDDLEWARE ====================');
  console.log('🔒 Path:', req.nextUrl.pathname);
  console.log('🔒 Cookies:', req.cookies.getAll());
  
  const accessToken = req.cookies.get("accessToken");
  
  console.log('🔒 accessToken présent:', accessToken ? 'OUI' : 'NON');
  
  const url = req.nextUrl.clone();

  // Si pas de token ET qu'on essaie d'accéder au dashboard
  if (!accessToken && url.pathname.startsWith("/dashboard")) {
    console.log('❌ Pas de token, redirection vers /login');
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Si token présent, laisser passer
  if (accessToken) {
    console.log('✅ Token présent, accès autorisé');
  }

  console.log('🔒 ==================== FIN MIDDLEWARE ====================');
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard"],
};