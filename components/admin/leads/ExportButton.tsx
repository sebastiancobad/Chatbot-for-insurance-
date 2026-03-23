'use client'

import type { Lead } from '@/lib/types'

interface Props {
  leads: Lead[]
}

export default function ExportButton({ leads }: Props) {
  function handleExport() {
    const headers = ['Nombre', 'WhatsApp', 'Email', 'Ramo', 'Urgencia', 'Estado', 'Fecha', 'Ciudad', 'Resumen', 'Notas']
    const rows = leads.map(l => [
      l.name,
      l.whatsapp,
      l.email ?? '',
      l.insuranceType,
      l.urgency,
      l.status,
      new Date(l.createdAt).toLocaleString('es-CO'),
      l.city ?? '',
      l.conversationSummary ?? '',
      l.notes ?? '',
    ])
    const csv = [headers, ...rows]
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 px-4 py-2 bg-white border border-border text-text-mid rounded-xl text-sm font-medium hover:border-blue hover:text-blue transition"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      CSV
    </button>
  )
}
