'use client'

import type { Lead, ConversationRecord } from './types'
import { generateId } from './store'

const LEADS_KEY = 'seguros_leads'
const CONVERSATIONS_KEY = 'seguros_conversations'
const LEADS_LAST_VIEWED_KEY = 'seguros_leads_last_viewed'

// --- Leads ---

export function getLeads(): Lead[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(LEADS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveLead(lead: Lead): void {
  const leads = getLeads()
  leads.unshift(lead)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
}

export function updateLead(id: string, updates: Partial<Lead>): void {
  const leads = getLeads().map(l => l.id === id ? { ...l, ...updates } : l)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
}

export function deleteLead(id: string): void {
  const leads = getLeads().filter(l => l.id !== id)
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
}

export function getLeadById(id: string): Lead | undefined {
  return getLeads().find(l => l.id === id)
}

export function createLead(data: Omit<Lead, 'id' | 'createdAt' | 'status' | 'source' | 'viewedByAdmin'>): Lead {
  const lead: Lead = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: 'nuevo',
    source: 'web',
    viewedByAdmin: false,
    ...data
  }
  saveLead(lead)
  return lead
}

// --- New leads counter ---

export function getNewLeadsCount(): number {
  const leads = getLeads()
  return leads.filter(l => !l.viewedByAdmin).length
}

export function markLeadsAsViewed(): void {
  const leads = getLeads().map(l => ({ ...l, viewedByAdmin: true }))
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads))
}

export function getLeadsToday(): Lead[] {
  const today = new Date().toISOString().split('T')[0]
  return getLeads().filter(l => l.createdAt.startsWith(today))
}

export function getLeadsThisMonth(): Lead[] {
  const now = new Date()
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return getLeads().filter(l => l.createdAt.startsWith(monthPrefix))
}

// --- Conversations ---

export function getConversations(): ConversationRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(CONVERSATIONS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveConversation(record: ConversationRecord): void {
  const convos = getConversations()
  const existing = convos.findIndex(c => c.id === record.id)
  if (existing >= 0) {
    convos[existing] = record
  } else {
    convos.unshift(record)
  }
  // Keep only last 100 conversations
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(convos.slice(0, 100)))
}

// --- CSV Export ---

export function exportLeadsCSV(): string {
  const leads = getLeads()
  const headers = ['ID', 'Fecha', 'Nombre', 'WhatsApp', 'Email', 'Tipo Seguro', 'Urgencia', 'Estado', 'Resumen', 'Notas', 'Fuente']
  const rows = leads.map(l => [
    l.id,
    new Date(l.createdAt).toLocaleString('es'),
    l.name,
    l.whatsapp,
    l.email || '',
    l.insuranceType,
    l.urgency,
    l.status,
    `"${(l.conversationSummary || '').replace(/"/g, '""')}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`,
    l.source
  ])
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}
