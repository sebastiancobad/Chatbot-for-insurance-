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

    // Log the lead (in production this would save to a database and send emails)
    console.log('=== NUEVO LEAD DEL COTIZADOR ===')
    console.log(`Nombre: ${contactData.name}`)
    console.log(`WhatsApp: ${contactData.whatsapp}`)
    console.log(`Email: ${contactData.email || 'N/A'}`)
    console.log(`Ciudad: ${contactData.city || 'N/A'}`)
    console.log(`Seguro: ${insuranceType}`)
    console.log(`Plan: ${selectedPlan?.name} - ${selectedPlan?.insurer}`)
    console.log(`Resumen: ${summary}`)
    console.log('================================')

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
