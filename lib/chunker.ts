import { DocumentChunk } from './types'

const CHUNK_SIZE = 2000    // ~2000 caracteres por chunk
const CHUNK_OVERLAP = 200  // 200 caracteres de solapamiento

// Divide un texto largo en chunks con overlap para mantener contexto
export function chunkText(
  text: string,
  docId: string,
  docName: string
): DocumentChunk[] {
  if (!text || text.length === 0) return []

  // Si el texto cabe en un solo chunk, retornar directamente
  if (text.length <= CHUNK_SIZE) {
    return [{
      id: `${docId}-0`,
      docId,
      docName,
      content: text,
      chunkIndex: 0,
      totalChunks: 1,
    }]
  }

  const chunks: DocumentChunk[] = []
  let start = 0

  while (start < text.length) {
    let end = start + CHUNK_SIZE

    // No cortar a mitad de palabra: buscar el último espacio o salto de línea
    if (end < text.length) {
      const lastNewline = text.lastIndexOf('\n', end)
      const lastSpace = text.lastIndexOf(' ', end)
      const breakPoint = Math.max(lastNewline, lastSpace)

      if (breakPoint > start + CHUNK_SIZE * 0.5) {
        end = breakPoint + 1
      }
    } else {
      end = text.length
    }

    chunks.push({
      id: `${docId}-${chunks.length}`,
      docId,
      docName,
      content: text.slice(start, end).trim(),
      chunkIndex: chunks.length,
      totalChunks: 0, // Se actualiza después
    })

    // Avanzar con overlap
    start = end - CHUNK_OVERLAP
    if (start >= text.length) break
  }

  // Actualizar totalChunks en todos los chunks
  return chunks.map(chunk => ({
    ...chunk,
    totalChunks: chunks.length,
  }))
}

// Estimar tokens aproximados (1 token ≈ 4 caracteres en español)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}
