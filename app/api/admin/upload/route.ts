import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { extractTextFromPDF, extractTextFromPlain } from '@/lib/pdf'
import { chunkText } from '@/lib/chunker'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const isAuthenticated = await verifyAuth()
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado. Inicia sesión primero.' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó un archivo.' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    const fileName = file.name.toLowerCase()
    const isValidType = fileName.endsWith('.pdf')
      || fileName.endsWith('.txt')
      || fileName.endsWith('.md')

    if (!isValidType) {
      return NextResponse.json(
        { error: 'Tipo de archivo no soportado. Solo se aceptan PDF, TXT y MD.' },
        { status: 400 }
      )
    }

    // Validar tamaño (máximo 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo excede el tamaño máximo de 10MB.' },
        { status: 400 }
      )
    }

    let text: string
    let pageCount = 0
    const docId = Date.now().toString(36) + Math.random().toString(36).slice(2, 9)

    if (fileName.endsWith('.pdf')) {
      // Procesar PDF
      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await extractTextFromPDF(buffer)
      text = result.text
      pageCount = result.pageCount
    } else {
      // Procesar TXT o MD
      const content = await file.text()
      text = extractTextFromPlain(content)
      pageCount = 1
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'No se pudo extraer texto del archivo. Verifica que no esté vacío o sea una imagen.' },
        { status: 422 }
      )
    }

    // Dividir en chunks
    const chunks = chunkText(text, docId, file.name)

    return NextResponse.json({
      docId,
      chunks,
      pageCount,
      charCount: text.length,
    })
  } catch (error) {
    console.error('Error procesando archivo:', error)
    return NextResponse.json(
      { error: 'Error al procesar el archivo. Intenta con otro documento.' },
      { status: 500 }
    )
  }
}
