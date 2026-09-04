import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const NOMBRE_COOKIE = "sesion_apatia";

function clave() {
  const secreto = process.env.SESSION_SECRET || "clave-de-desarrollo-insegura";
  return new TextEncoder().encode(secreto);
}

async function haySesion(req: NextRequest) {
  const token = req.cookies.get(NOMBRE_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, clave());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // El panel (excepto la nada, ya vive bajo /panel) requiere sesión.
  if (pathname.startsWith("/panel")) {
    const ok = await haySesion(req);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/acceso";
      url.searchParams.set("desde", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*"],
};
