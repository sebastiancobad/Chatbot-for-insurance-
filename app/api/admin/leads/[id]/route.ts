import { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const isAuth = await verifyAuth()
  if (!isAuth) return Response.json({ error: 'No autorizado' }, { status: 401 })

  return Response.json({
    id: params.id,
    note: 'Lead data is managed client-side via localStorage.',
  })
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const isAuth = await verifyAuth()
  if (!isAuth) return Response.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()

  return Response.json({
    ok: true,
    id: params.id,
    updates: body,
    note: 'Lead updates are handled client-side. This endpoint is a placeholder for future DB migration.',
  })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const isAuth = await verifyAuth()
  if (!isAuth) return Response.json({ error: 'No autorizado' }, { status: 401 })

  return Response.json({
    ok: true,
    id: params.id,
    note: 'Lead deletion is handled client-side.',
  })
}
