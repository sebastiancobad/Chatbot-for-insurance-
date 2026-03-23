import { verifyAuth } from '@/lib/auth'

export async function GET() {
  const isAuth = await verifyAuth()
  if (!isAuth) return Response.json({ error: 'No autorizado' }, { status: 401 })

  // Placeholder — stats are calculated client-side from localStorage
  return Response.json({
    leadsThisMonth: 0,
    leadsToday: 0,
    leadsNewCount: 0,
    leadsPendingQuote: 0,
    leadsClosedWon: 0,
    conversionRate: 0,
    byType: [],
    byWeek: [],
    note: 'Stats are calculated client-side from localStorage data.',
  })
}
