import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contactData, insuranceType, answers, selectedPlan } = body

    if (!contactData?.name || !contactData?.whatsapp || !insuranceType) {
      return Response.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      )
    }

    // Build summary
    const answerSummary = Object.entries(answers || {})
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? (v as string[]).join(', ') : v}`)
      .join(' | ')

    const summary = `[Cotizador] Seguro de ${insuranceType} — Plan ${selectedPlan?.name || 'N/A'} (${selectedPlan?.price ? `$${selectedPlan.price.toLocaleString('es-CO')}/mes` : 'N/A'}) | ${answerSummary}`

    return Response.json(
      {
        ok: true,
        lead: {
          name: contactData.name,
          whatsapp: contactData.whatsapp,
          insuranceType,
          plan: selectedPlan?.name,
          summary,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error en /api/quote:', error)
    return Response.json(
      { error: 'Error al procesar la cotización' },
      { status: 500 }
    )
  }
}
