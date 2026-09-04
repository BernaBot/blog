import { NextRequest, NextResponse } from "next/server";
import {
  firmarTokenSesion,
  NOMBRE_COOKIE_SESION,
  DURACION_SEGUNDOS,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { usuario, password } = await req.json();

  const usuarioOk = process.env.ADMIN_USER || "elAutor";
  const passOk = process.env.ADMIN_PASSWORD || "Espejo123";

  if (usuario === usuarioOk && password === passOk) {
    const token = await firmarTokenSesion();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(NOMBRE_COOKIE_SESION, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: DURACION_SEGUNDOS,
    });
    return res;
  }

  return NextResponse.json(
    { ok: false, error: "Usuario o contraseña incorrectos." },
    { status: 401 }
  );
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(NOMBRE_COOKIE_SESION, "", { path: "/", maxAge: 0 });
  return res;
}
