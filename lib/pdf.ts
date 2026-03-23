// Extracción de texto desde archivos PDF
// Usa pdf-parse en el servidor para convertir PDFs a texto plano

export async function extractTextFromPDF(buffer: Buffer): Promise<{
  text: string
  pageCount: number
}> {
  // pdf-parse requiere importación dinámica en Next.js
  const pdfParse = (await import('pdf-parse')).default

  const data = await pdfParse(buffer)

  // Limpiar el texto: normalizar espacios, remover caracteres extraños
  const cleanedText = data.text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[^\S\n]+/g, ' ')      // Múltiples espacios → uno solo
    .replace(/\n{3,}/g, '\n\n')     // Máximo 2 saltos de línea seguidos
    .replace(/[^\x20-\x7E\xA0-\xFF\n áéíóúñÁÉÍÓÚÑüÜ¿¡]/g, '') // Solo caracteres válidos + español
    .trim()

  return {
    text: cleanedText,
    pageCount: data.numpages,
  }
}

// Extraer texto de archivos TXT o MD (sin procesamiento especial)
export function extractTextFromPlain(content: string): string {
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
