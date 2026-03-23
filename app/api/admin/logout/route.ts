import { NextResponse } from 'next/server'

// Cerrar sesión eliminando la cookie de autenticación
export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}
