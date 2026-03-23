'use client'

// Gestión de estado con localStorage (MVP)
// Para producción, migrar a Vercel KV/Blob

import { StoredDocument, AgencyConfig, DocumentChunk } from './types'

const DOCS_KEY = 'seguros_documents'
const CONFIG_KEY = 'seguros_config'

const DEFAULT_CONFIG: AgencyConfig = {
  name: 'Mi Agencia de Seguros',
  slogan: 'Protegemos lo que más importa',
  faqs: [
    '¿Qué cubre mi póliza de auto?',
    '¿Cómo reporto un siniestro?',
    '¿Cuáles son mis beneficios de salud?',
    '¿Qué tipos de seguros ofrecen?',
  ],
  lastUpdated: new Date().toISOString(),
}

// --- Documentos ---

export function getDocuments(): StoredDocument[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(DOCS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveDocument(doc: StoredDocument): void {
  const docs = getDocuments()
  docs.push(doc)
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs))
}

export function deleteDocument(docId: string): void {
  const docs = getDocuments().filter(d => d.id !== docId)
  localStorage.setItem(DOCS_KEY, JSON.stringify(docs))
}

export function getAllChunks(): DocumentChunk[] {
  return getDocuments().flatMap(doc => doc.chunks)
}

// --- Configuración de la agencia ---

export function getConfig(): AgencyConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  try {
    const data = localStorage.getItem(CONFIG_KEY)
    return data ? JSON.parse(data) : DEFAULT_CONFIG
  } catch {
    return DEFAULT_CONFIG
  }
}

export function saveConfig(config: AgencyConfig): void {
  config.lastUpdated = new Date().toISOString()
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

// --- Utilidades ---

export function getTotalTokenEstimate(): number {
  const chunks = getAllChunks()
  const totalChars = chunks.reduce((sum, c) => sum + c.content.length, 0)
  return Math.ceil(totalChars / 4) // ~4 chars por token en español
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}
