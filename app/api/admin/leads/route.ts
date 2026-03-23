import { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'

// This is a server-side placeholder.
// Actual lead data lives in localStorage (client-side).
// These routes exist for API consistency and future DB migration.

export async function GET(request: NextRequest) {
  const isAuth = await verifyAuth()
  if (!isAuth) return Response.json({ error: 'No autorizado' }, { status: 401 })

  // In a real app, query from database with filters
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const type = searchParams.get('type')
  const count = searchParams.get('count')

  // Placeholder response — client-side fetches from localStorage
  return Response.json({
    leads: [],
    total: 0,
    pages: 1,
    filters: { status, type, count },
    note: 'Data is managed client-side via localStorage. Use client components to access leads.',
  })
}

export async function POST(request: NextRequest) {
  const isAuth = await verifyAuth()
  if (!isAuth) return Response.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const { name, whatsapp, insuranceType } = body

  if (!name || !whatsapp || !insuranceType) {
    return Response.json({ error: 'Campos requeridos: name, whatsapp, insuranceType' }, { status: 400 })
  }

  // In a real app, save to database
  return Response.json({
    ok: true,
    note: 'Lead creation is handled client-side. This endpoint is a placeholder for future DB migration.',
  }, { status: 201 })
}
