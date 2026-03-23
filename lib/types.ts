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

// --- Módulo de Ventas ---

export type InsuranceType = 'auto' | 'vida' | 'salud' | 'hogar' | 'otro'
export type LeadStatus = 'nuevo' | 'contactado' | 'cotizado' | 'cerrado' | 'perdido'
export type UrgencyLevel = 'esta_semana' | 'este_mes' | 'explorando'

export interface Lead {
  id: string
  createdAt: string
  name: string
  whatsapp: string
  email?: string
  insuranceType: InsuranceType
  urgency: UrgencyLevel
  conversationSummary: string
  status: LeadStatus
  notes?: string
  quoteData?: Record<string, string>
  source: 'web' | 'whatsapp'
  viewedByAdmin?: boolean
}

export interface ConversationRecord {
  id: string
  startedAt: string
  messages: Message[]
  leadId?: string
  insuranceType?: string
}

export type QuoteStep = {
  id: string
  question: string
  key: string
  type: 'text' | 'select' | 'boolean'
  options?: string[]
}

export type QuoteFlow = {
  [ramo: string]: QuoteStep[]
}

export type InsuranceIntent = {
  hasPurchaseIntent: boolean
  insuranceType: InsuranceType | null
  wantsComparison: boolean
  wantsQuote: boolean
}

// Estado del flujo de captura en el chat
export type ChatSalesState = {
  active: boolean
  flow: 'none' | 'lead_capture' | 'quoting' | 'comparison'
  insuranceType: InsuranceType | null
  // Lead capture
  captureStep: 'name' | 'whatsapp' | 'email' | 'urgency' | 'done'
  capturedData: Partial<Pick<Lead, 'name' | 'whatsapp' | 'email' | 'urgency'>>
  // Quote flow
  quoteStepIndex: number
  quoteAnswers: Record<string, string>
  // Tracking
  questionCountByType: Record<string, number>
}
