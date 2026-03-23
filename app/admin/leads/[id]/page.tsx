'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getLeadById, updateLead, deleteLead } from '@/lib/leadStore'
import { getConfig } from '@/lib/store'
import type { Lead, LeadStatus } from '@/lib/types'
import LeadStatusSelect from '@/components/admin/leads/LeadStatusSelect'

const TYPE_LABELS: Record<string, string> = {
  auto: 'Auto', vida: 'Vida', salud: 'Salud', hogar: 'Hogar',
  accidentes: 'Accidentes', empresarial: 'Empresarial', otro: 'Otro',
}

const URGENCY_LABELS: Record<string, string> = {
  esta_semana: 'Esta semana', este_mes: 'Este mes', explorando: 'Explorando',
}

const SOURCE_LABELS: Record<string, string> = {
  web: 'Chat web', whatsapp: 'WhatsApp', cotizador: 'Cotizador', manual: 'Manual',
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

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [notes, setNotes] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const agencyName = getConfig().name

  useEffect(() => {
    const id = params.id as string
    const found = getLeadById(id)
    if (found) {
      setLead(found)
      setNotes(found.notes || '')
      setFollowUpDate(found.followUpAt?.split('T')[0] || '')
    }
  }, [params.id])

  if (!lead) {
    return (
      <div className="text-center py-16">
        <p className="text-text-soft">Lead no encontrado</p>
        <button onClick={() => router.push('/admin/leads')} className="mt-3 text-blue text-sm hover:underline">
          Volver a Leads
        </button>
      </div>
    )
  }

  function refresh() {
    const updated = getLeadById(lead!.id)
    if (updated) setLead(updated)
  }

  function handleStatusChange(status: LeadStatus) {
    const updates: Partial<Lead> = { status }
    if (status === 'contactado' && !lead!.contactedAt) {
      updates.contactedAt = new Date().toISOString()
    }
    if (status === 'cerrado') {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3000)
    }
    updateLead(lead!.id, updates)
    refresh()
  }

  function handleSaveNotes() {
    updateLead(lead!.id, { notes })
    refresh()
  }

  function handleSaveFollowUp() {
    updateLead(lead!.id, { followUpAt: followUpDate ? new Date(followUpDate).toISOString() : undefined })
    refresh()
  }

  function handleDelete() {
    deleteLead(lead!.id)
    router.push('/admin/leads')
  }

  const waMsg = encodeURIComponent(
    `Hola ${lead.name}, te contacto de ${agencyName} sobre tu consulta de seguro de ${(TYPE_LABELS[lead.insuranceType] || '').toLowerCase()}. ¿Tienes un momento para hablar?`
  )

  return (
    <div className="max-w-4xl">
      {/* Back button */}
      <button onClick={() => router.push('/admin/leads')} className="flex items-center gap-1.5 text-text-soft hover:text-blue text-sm mb-4 transition">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Volver a Leads
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-title text-2xl font-bold text-text">{lead.name}</h1>
          <p className="text-text-mid text-sm">
            Seguro de {TYPE_LABELS[lead.insuranceType] || lead.insuranceType} ·{' '}
            <span className={`font-medium ${lead.urgency === 'esta_semana' ? 'text-red-500' : ''}`}>
              {URGENCY_LABELS[lead.urgency]}
            </span> · {timeAgo(lead.createdAt)}
          </p>
        </div>
        <a
          href={`https://wa.me/57${lead.whatsapp.replace(/\D/g, '')}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-medium text-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
          </svg>
          Abrir WhatsApp
        </a>
      </div>

      {/* Celebration */}
      {showCelebration && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center mb-6">
          <p className="text-xl font-bold text-green-700">Felicitaciones!</p>
          <p className="text-sm text-green-600">Otro lead cerrado con éxito.</p>
        </div>
      )}

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Contact info */}
        <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
          <h3 className="font-semibold text-text text-sm uppercase tracking-wider text-text-soft">Datos de contacto</h3>
          <InfoRow icon="📱" label="WhatsApp" value={lead.whatsapp} />
          {lead.email && <InfoRow icon="📧" label="Email" value={lead.email} />}
          {lead.city && <InfoRow icon="📍" label="Ciudad" value={lead.city} />}
          <InfoRow icon="📂" label="Fuente" value={SOURCE_LABELS[lead.source] || lead.source} />
          <InfoRow icon="🕐" label="Creado" value={new Date(lead.createdAt).toLocaleString('es-CO')} />
          {lead.contactedAt && <InfoRow icon="📞" label="Primer contacto" value={new Date(lead.contactedAt).toLocaleString('es-CO')} />}
        </div>

        {/* Quote data */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-text-soft mb-3">Cotización</h3>
          {lead.quoteData && Object.keys(lead.quoteData).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(lead.quoteData).map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                  <span className="text-text-mid capitalize">{k.replace(/_/g, ' ')}</span>
                  <span className="text-text font-medium">{v}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-soft text-sm">Sin datos de cotización</p>
          )}
          {lead.conversationSummary && (
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-text-soft font-medium mb-1">Resumen</p>
              <p className="text-sm text-text">{lead.conversationSummary}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status, notes, follow-up */}
      <div className="bg-white rounded-2xl border border-border p-5 space-y-5">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-text-soft">Estado y seguimiento</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-text-soft mb-1">Estado actual</label>
            <LeadStatusSelect value={lead.status} onChange={handleStatusChange} />
          </div>
          <div>
            <label className="block text-xs text-text-soft mb-1">Recordatorio</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-blue"
              />
              <button onClick={handleSaveFollowUp} className="px-3 py-2 bg-blue text-white text-xs rounded-xl hover:bg-blue-mid transition font-medium">
                Guardar
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-soft mb-1">Notas</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-blue resize-none"
            placeholder="Agrega notas sobre este lead..."
          />
          <button onClick={handleSaveNotes} className="mt-2 px-4 py-2 bg-blue text-white text-xs rounded-xl hover:bg-blue-mid transition font-medium">
            Guardar notas
          </button>
        </div>
      </div>

      {/* Delete */}
      <div className="mt-6 pt-4 border-t border-border">
        {showDeleteConfirm ? (
          <div className="flex gap-2 max-w-xs">
            <button onClick={handleDelete} className="flex-1 py-2 bg-red-500 text-white text-sm rounded-xl font-medium hover:bg-red-600 transition">
              Confirmar eliminar
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2 border border-border text-text-mid text-sm rounded-xl hover:bg-gray-50 transition">
              Cancelar
            </button>
          </div>
        ) : (
          <button onClick={() => setShowDeleteConfirm(true)} className="text-red-400 text-sm hover:text-red-600 transition">
            Eliminar lead
          </button>
        )}
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{icon}</span>
      <span className="text-xs text-text-soft w-20">{label}</span>
      <span className="text-sm text-text">{value}</span>
    </div>
  )
}
