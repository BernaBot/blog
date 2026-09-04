import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const NOMBRE_COOKIE_SESION = "sesion_apatia";
export const DURACION_SEGUNDOS = 60 * 60 * 24 * 7; // 7 días

function clave() {
  const secreto = process.env.SESSION_SECRET || "clave-de-desarrollo-insegura";
  return new TextEncoder().encode(secreto);
}

export async function firmarTokenSesion() {
  return new SignJWT({ rol: "autor" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACION_SEGUNDOS}s`)
    .sign(clave());
}

// Lee la sesión desde las cookies de la request actual (sirve en Server
// Components, Route Handlers y middleware indistintamente).
export async function haySesionValida(tokenDirecto?: string) {
  try {
    const token = tokenDirecto ?? cookies().get(NOMBRE_COOKIE_SESION)?.value;
    if (!token) return false;
    await jwtVerify(token, clave());
    return true;
  } catch {
    return false;
  }
}
