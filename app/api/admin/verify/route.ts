import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

// Endpoint para verificar si el admin está autenticado
export async function GET() {
  const isAuthenticated = await verifyAuth()
  if (!isAuthenticated) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  return NextResponse.json({ authenticated: true })
}
