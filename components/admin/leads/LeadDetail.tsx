'use client'

import { useState } from 'react'
import type { Lead, LeadStatus } from '@/lib/types'
import { updateLead, deleteLead } from '@/lib/leadStore'
import { getConfig } from '@/lib/store'
import LeadStatusSelect from './LeadStatusSelect'

const TYPE_LABELS: Record<string, string> = {
  auto: 'Auto', vida: 'Vida', salud: 'Salud', hogar: 'Hogar',
  accidentes: 'Accidentes', empresarial: 'Empresarial', otro: 'Otro',
}

const URGENCY_LABELS: Record<string, string> = {
  esta_semana: 'Esta semana', este_mes: 'Este mes', explorando: 'Explorando',
}

const URGENCY_COLORS: Record<string, string> = {
  esta_semana: 'text-red-500', este_mes: 'text-yellow-600', explorando: 'text-text-soft',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins} minuto${mins !== 1 ? 's' : ''}`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours} hora${hours !== 1 ? 's' : ''}`
  const days = Math.floor(hours / 24)
  return `hace ${days} día${days !== 1 ? 's' : ''}`
}

interface Props {
  lead: Lead
  onClose: () => void
  onUpdate: () => void
}

export default function LeadDetail({ lead, onClose, onUpdate }: Props) {
  const [notes, setNotes] = useState(lead.notes || '')
  const [followUpDate, setFollowUpDate] = useState(lead.followUpAt?.split('T')[0] || '')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const agencyName = getConfig().name

  function handleStatusChange(status: LeadStatus) {
    const updates: Partial<Lead> = { status }
    if (status === 'contactado' && !lead.contactedAt) {
      updates.contactedAt = new Date().toISOString()
    }
    if (status === 'cerrado') {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
    updateLead(lead.id, updates)
    onUpdate()
  }

  function handleSaveNotes() {
    updateLead(lead.id, { notes })
    onUpdate()
  }

  function handleSaveFollowUp() {
    updateLead(lead.id, { followUpAt: followUpDate ? new Date(followUpDate).toISOString() : undefined })
    onUpdate()
  }

  function handleDelete() {
    deleteLead(lead.id)
    onUpdate()
    onClose()
  }

  const waMsg = encodeURIComponent(
    `Hola ${lead.name}, te contacto de ${agencyName} sobre tu consulta de seguro de ${(TYPE_LABELS[lead.insuranceType] || lead.insuranceType).toLowerCase()}. ¿Tienes un momento para hablar?`
  )

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="relative w-full max-w-md bg-white shadow-xl overflow-y-auto animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-title text-xl font-bold text-text">{lead.name}</h3>
              <p className="text-xs text-text-soft">
                Seguro de {TYPE_LABELS[lead.insuranceType] || lead.insuranceType} · {timeAgo(lead.createdAt)}
              </p>
            </div>
            <button onClick={onClose} className="text-text-soft hover:text-text p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
                <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Celebration modal */}
          {showCelebration && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-green-700">Felicitaciones!</p>
              <p className="text-sm text-green-600">Otro lead cerrado con éxito.</p>
            </div>
          )}

          {/* Contact info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2.5 bg-bg rounded-xl">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72"/>
              </svg>
              <span className="text-sm text-text flex-1">{lead.whatsapp}</span>
            </div>
            {lead.email && (
              <div className="flex items-center gap-2 p-2.5 bg-bg rounded-xl">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <span className="text-sm text-text flex-1">{lead.email}</span>
              </div>
            )}
            {lead.city && (
              <div className="flex items-center gap-2 p-2.5 bg-bg rounded-xl">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-sm text-text flex-1">{lead.city}</span>
              </div>
            )}

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/57${lead.whatsapp.replace(/\D/g, '')}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-medium text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
              Abrir WhatsApp
            </a>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs text-text-soft font-medium mb-1.5 uppercase tracking-wider">Estado</label>
            <LeadStatusSelect value={lead.status} onChange={handleStatusChange} />
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-xs text-text-soft font-medium mb-1 uppercase tracking-wider">Urgencia</label>
            <p className={`text-sm font-medium ${URGENCY_COLORS[lead.urgency]}`}>
              {URGENCY_LABELS[lead.urgency] || lead.urgency}
            </p>
          </div>

          {/* Quote Data */}
          {lead.quoteData && Object.keys(lead.quoteData).length > 0 && (
            <div>
              <label className="block text-xs text-text-soft font-medium mb-1.5 uppercase tracking-wider">Datos de cotización</label>
              <div className="bg-bg rounded-xl p-3 space-y-1.5">
                {Object.entries(lead.quoteData).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs">
                    <span className="text-text-mid capitalize">{k.replace(/_/g, ' ')}</span>
                    <span className="text-text font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {lead.conversationSummary && (
            <div>
              <label className="block text-xs text-text-soft font-medium mb-1.5 uppercase tracking-wider">Resumen</label>
              <p className="text-sm text-text bg-bg rounded-xl p-3">{lead.conversationSummary}</p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs text-text-soft font-medium mb-1.5 uppercase tracking-wider">Notas del agente</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue resize-none"
              placeholder="Agrega notas sobre este lead..."
            />
            <button
              onClick={handleSaveNotes}
              className="mt-1.5 px-4 py-1.5 bg-blue text-white text-xs rounded-lg hover:bg-blue-mid transition font-medium"
            >
              Guardar nota
            </button>
          </div>

          {/* Follow-up */}
          <div>
            <label className="block text-xs text-text-soft font-medium mb-1.5 uppercase tracking-wider">Recordatorio</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
              />
              <button
                onClick={handleSaveFollowUp}
                className="px-4 py-2 bg-blue text-white text-xs rounded-xl hover:bg-blue-mid transition font-medium"
              >
                Guardar
              </button>
            </div>
          </div>

          {/* Source + date */}
          <div className="pt-2 border-t border-border">
            <div className="flex justify-between text-xs text-text-soft">
              <span>Fuente: {lead.source === 'cotizador' ? 'Cotizador' : lead.source === 'manual' ? 'Manual' : lead.source === 'whatsapp' ? 'WhatsApp' : 'Chat web'}</span>
              <span>{new Date(lead.createdAt).toLocaleString('es-CO')}</span>
            </div>
          </div>

          {/* Delete */}
          <div className="pt-2">
            {showDeleteConfirm ? (
              <div className="flex gap-2">
                <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 text-white text-xs rounded-xl font-medium hover:bg-red-600 transition">
                  Confirmar eliminar
                </button>
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 border border-border text-text-mid text-xs rounded-xl hover:bg-gray-50 transition">
                  Cancelar
                </button>
              </div>
            ) : (
              <button onClick={() => setShowDeleteConfirm(true)} className="w-full py-2 text-red-400 text-xs hover:text-red-600 transition">
                Eliminar lead
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slideIn 0.25s ease-out; }
      `}</style>
    </div>
  )
}
