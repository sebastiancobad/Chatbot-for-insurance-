// Tipos principales del sistema de chatbot de seguros

export interface DocumentChunk {
  id: string
  docId: string
  docName: string
  content: string
  chunkIndex: number
  totalChunks: number
}

export interface StoredDocument {
  id: string
  name: string
  size: number
  fileType: 'pdf' | 'txt' | 'md'
  uploadedAt: string
  chunks: DocumentChunk[]
  pageCount?: number
  charCount: number
}

export interface AgencyConfig {
  name: string
  slogan: string
  faqs: string[]
  lastUpdated: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface ChatRequest {
  messages: Message[]
  documents: DocumentChunk[]
  agencyName?: string
}

export interface UploadResponse {
  chunks: DocumentChunk[]
  pageCount: number
  charCount: number
}
