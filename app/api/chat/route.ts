import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'
import { selectRelevantChunks } from '@/lib/relevance'
import type { DocumentChunk } from '@/lib/types'

// Rate limiting básico en memoria (MVP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 20       // máximo requests
const RATE_WINDOW = 3600000 // por hora (ms)

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || '127.0.0.1'
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIP(request)
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: 'Has excedido el límite de consultas. Intenta de nuevo en una hora.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verificar API key
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'La API de Anthropic no está configurada. Contacta al administrador.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body = await request.json()
    const { messages, documents, agencyName } = body as {
      messages: { role: 'user' | 'assistant'; content: string }[]
      documents: DocumentChunk[]
      agencyName?: string
    }

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No se proporcionaron mensajes.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Seleccionar chunks relevantes para la última pregunta del usuario
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
    const relevantChunks = lastUserMessage
      ? selectRelevantChunks(lastUserMessage.content, documents || [], 6)
      : (documents || []).slice(0, 6)

    // Construir contexto de documentos
    const documentContext = relevantChunks.length > 0
      ? relevantChunks.map(chunk =>
        `[Documento: ${chunk.docName} | Parte ${chunk.chunkIndex + 1}/${chunk.totalChunks}]\n${chunk.content}`
      ).join('\n\n---\n\n')
      : 'No hay documentos cargados en este momento.'

    const agency = agencyName || 'nuestra agencia de seguros'

    const systemPrompt = `Eres un asesor virtual de seguros para ${agency}. Tu función es responder las dudas de los clientes sobre sus pólizas de manera clara, empática y profesional.

REGLAS ESTRICTAS:
1. Responde ÚNICAMENTE con información contenida en los documentos proporcionados.
2. Si la información no está en los documentos, responde: "Esa información no está disponible en la documentación actual. Te recomiendo comunicarte directamente con tu agente para una respuesta precisa."
3. NUNCA inventes coberturas, montos, plazos ni condiciones que no estén en los documentos.
4. Cuando sea útil, indica de qué documento proviene la información.
5. Usa lenguaje claro y empático. Evita tecnicismos innecesarios.
6. Usa listas cuando ayude a la claridad.
7. Responde siempre en español.
8. Si la pregunta no es sobre seguros, responde: "Mi función es asistirte exclusivamente con consultas sobre tus pólizas y seguros."
9. Sé conciso: respuestas de máximo 3-4 párrafos salvo que la pregunta requiera más detalle.

DOCUMENTOS DE REFERENCIA:
${documentContext}`

    // Crear cliente de Anthropic
    const anthropic = new Anthropic({ apiKey })
    const model = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514'

    // Crear stream con la API de Anthropic
    const stream = anthropic.messages.stream({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    })

    // Convertir a ReadableStream para streaming al cliente
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta
              if ('text' in delta) {
                controller.enqueue(encoder.encode(delta.text))
              }
            }
          }
          controller.close()
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : 'Error desconocido'
          controller.enqueue(encoder.encode(`\n\n[Error: ${errMsg}]`))
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Error en /api/chat:', error)

    const message = error instanceof Error ? error.message : 'Error interno del servidor'

    // Errores comunes de la API de Anthropic
    if (message.includes('401') || message.includes('authentication')) {
      return new Response(
        JSON.stringify({ error: 'La API key de Anthropic es inválida. Contacta al administrador.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (message.includes('429') || message.includes('rate')) {
      return new Response(
        JSON.stringify({ error: 'Se ha excedido el límite de uso de la API. Intenta en unos minutos.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Ocurrió un error al procesar tu consulta. Intenta de nuevo.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
