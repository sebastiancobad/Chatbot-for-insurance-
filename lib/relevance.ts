import { DocumentChunk } from './types'

// Selección inteligente de chunks por relevancia (búsqueda por palabras clave)
// Para producción, migrar a embeddings vectoriales

// Palabras comunes en español que no aportan significado para la búsqueda
const STOP_WORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del',
  'en', 'a', 'al', 'por', 'para', 'con', 'sin', 'sobre', 'entre',
  'que', 'es', 'son', 'fue', 'ser', 'está', 'hay', 'como', 'más',
  'pero', 'su', 'sus', 'mi', 'mis', 'tu', 'tus', 'nos', 'se',
  'le', 'lo', 'ya', 'o', 'y', 'no', 'si', 'muy', 'me', 'te',
  'qué', 'cuál', 'cómo', 'dónde', 'cuándo', 'cuánto',
  'hola', 'gracias', 'favor', 'puede', 'puedo', 'tiene', 'tengo',
])

// Tokenizar texto: convertir a minúsculas, extraer palabras significativas
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos para comparación
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOP_WORDS.has(word))
}

// Calcular relevancia de un chunk para una consulta
function scoreChunk(chunk: DocumentChunk, queryTokens: string[]): number {
  const chunkTokens = tokenize(chunk.content)
  const chunkTokenArray = Array.from(new Set(chunkTokens))

  let score = 0

  for (const token of queryTokens) {
    // Match exacto
    if (chunkTokenArray.includes(token)) {
      score += 2
    }
    // Match parcial (el token de la query está contenido en alguna palabra del chunk)
    for (const chunkToken of chunkTokenArray) {
      if (chunkToken.includes(token) || token.includes(chunkToken)) {
        score += 1
        break
      }
    }
  }

  // Bonus por densidad: más matches por longitud = más relevante
  if (chunkTokenArray.length > 0) {
    score = score / Math.sqrt(chunkTokenArray.length)
  }

  return score
}

// Seleccionar los chunks más relevantes para una pregunta
export function selectRelevantChunks(
  query: string,
  chunks: DocumentChunk[],
  maxChunks: number = 6
): DocumentChunk[] {
  if (chunks.length === 0) return []
  if (chunks.length <= maxChunks) return chunks

  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) return chunks.slice(0, maxChunks)

  const scored = chunks.map(chunk => ({
    chunk,
    score: scoreChunk(chunk, queryTokens),
  }))

  // Ordenar por relevancia descendente
  scored.sort((a, b) => b.score - a.score)

  // Retornar los más relevantes (solo los que tienen algún score > 0)
  const relevant = scored
    .filter(s => s.score > 0)
    .slice(0, maxChunks)
    .map(s => s.chunk)

  // Si no hay matches, retornar los primeros chunks como fallback
  return relevant.length > 0 ? relevant : chunks.slice(0, maxChunks)
}
