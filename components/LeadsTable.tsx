'use client'

import { useState, useEffect, useMemo } from 'react'
import { getLeads, updateLead, markLeadsAsViewed, exportLeadsCSV, createLead } from '@/lib/leadStore'
import { getInsuranceTypeLabel } from '@/lib/intentDetector'
import { getConfig } from '@/lib/store'
import type { Lead, LeadStatus, InsuranceType, UrgencyLevel } from '@/lib/types'

const STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: 'Nuevo', contactado: 'Contactado', cotizado: 'Cotizado', negociando: 'Negociando', cerrado: 'Cerrado', perdido: 'Perdido'
}
const STATUS_COLORS: Record<LeadStatus, string> = {
  nuevo: 'bg-blue-light text-blue', contactado: 'bg-yellow-50 text-yellow-700',
  cotizado: 'bg-purple-50 text-purple-700', negociando: 'bg-orange-50 text-orange-700',
  cerrado: 'bg-green-50 text-green-700', perdido: 'bg-red-50 text-red-500'
}

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all')
  const [filterType, setFilterType] = useState<InsuranceType | 'all'>('all')
  const [filterUrgency, setFilterUrgency] = useState<UrgencyLevel | 'all'>('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [notes, setNotes] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const agencyName = getConfig().name

  useEffect(() => {
    setLeads(getLeads())
    markLeadsAsViewed()
  }, [])

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (filterStatus !== 'all' && l.status !== filterStatus) return false
      if (filterType !== 'all' && l.insuranceType !== filterType) return false
      if (filterUrgency !== 'all' && l.urgency !== filterUrgency) return false
      return true
    })
  }, [leads, filterStatus, filterType, filterUrgency])

  const handleStatusChange = (id: string, status: LeadStatus) => {
    updateLead(id, { status })
    setLeads(getLeads())
    if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, status })
  }

  const handleSaveNotes = (id: string) => {
    updateLead(id, { notes })
    setLeads(getLeads())
    if (selectedLead?.id === id) setSelectedLead({ ...selectedLead, notes })
  }

  const handleExport = () => {
    const csv = exportLeadsCSV()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const openDetail = (lead: Lead) => {
    setSelectedLead(lead)
    setNotes(lead.notes || '')
  }

  const todayLeads = leads.filter(l => l.createdAt.startsWith(new Date().toISOString().split('T')[0]))

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-title text-xl font-bold text-text">Gestión de Leads</h2>
          <p className="text-sm text-text-soft">{todayLeads.length} lead{todayLeads.length !== 1 ? 's' : ''} nuevo{todayLeads.length !== 1 ? 's' : ''} hoy</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-blue text-white rounded-xl text-sm font-medium hover:bg-blue-mid transition">
            + Agregar lead
          </button>
          <button onClick={handleExport} className="px-4 py-2 bg-white border border-border text-text-mid rounded-xl text-sm font-medium hover:border-blue transition">
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as LeadStatus | 'all')}
          className="px-3 py-2 border border-border rounded-xl text-sm text-text-mid focus:outline-none focus:border-blue"
        >
          <option value="all">Todos los estados</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value as InsuranceType | 'all')}
          className="px-3 py-2 border border-border rounded-xl text-sm text-text-mid focus:outline-none focus:border-blue"
        >
          <option value="all">Todos los ramos</option>
          <option value="auto">Auto</option>
          <option value="vida">Vida</option>
          <option value="salud">Salud</option>
          <option value="hogar">Hogar</option>
          <option value="accidentes">Accidentes</option>
          <option value="empresarial">Empresarial</option>
        </select>
        <select
          value={filterUrgency}
          onChange={e => setFilterUrgency(e.target.value as UrgencyLevel | 'all')}
          className="px-3 py-2 border border-border rounded-xl text-sm text-text-mid focus:outline-none focus:border-blue"
        >
          <option value="all">Toda urgencia</option>
          <option value="esta_semana">Esta semana</option>
          <option value="este_mes">Este mes</option>
          <option value="explorando">Explorando</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 text-text-mid font-medium">Nombre</th>
                <th className="text-left px-4 py-3 text-text-mid font-medium">WhatsApp</th>
                <th className="text-left px-4 py-3 text-text-mid font-medium">Tipo</th>
                <th className="text-left px-4 py-3 text-text-mid font-medium">Urgencia</th>
                <th className="text-left px-4 py-3 text-text-mid font-medium">Estado</th>
                <th className="text-left px-4 py-3 text-text-mid font-medium">Fecha</th>
                <th className="text-left px-4 py-3 text-text-mid font-medium">Resumen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-text-soft">No hay leads que coincidan con los filtros</td></tr>
              ) : filtered.map(lead => (
                <tr
                  key={lead.id}
                  onClick={() => openDetail(lead)}
                  className={`border-b border-border/50 cursor-pointer hover:bg-blue-light/30 transition ${
                    lead.urgency === 'esta_semana' && lead.status === 'nuevo' ? 'bg-yellow-50/50' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-text">{lead.name}</td>
                  <td className="px-4 py-3 text-text-mid">{lead.whatsapp}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-blue-light text-blue text-xs rounded-full">{getInsuranceTypeLabel(lead.insuranceType)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${lead.urgency === 'esta_semana' ? 'text-red-500 font-medium' : 'text-text-soft'}`}>
                      {lead.urgency === 'esta_semana' ? 'Esta semana' : lead.urgency === 'este_mes' ? 'Este mes' : 'Explorando'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_COLORS[lead.status]}`}>
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-soft text-xs">
                    {new Date(lead.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-4 py-3 text-text-soft text-xs max-w-[200px] truncate">{lead.conversationSummary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Side Panel */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedLead(null)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-full max-w-md bg-white shadow-xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-title text-lg font-bold text-text">{selectedLead.name}</h3>
                <button onClick={() => setSelectedLead(null)} className="text-text-soft hover:text-text">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <InfoRow label="WhatsApp" value={selectedLead.whatsapp} />
                {selectedLead.email && <InfoRow label="Email" value={selectedLead.email} />}
                <InfoRow label="Tipo de seguro" value={getInsuranceTypeLabel(selectedLead.insuranceType)} />
                <InfoRow label="Urgencia" value={selectedLead.urgency === 'esta_semana' ? 'Esta semana' : selectedLead.urgency === 'este_mes' ? 'Este mes' : 'Explorando'} />
                <InfoRow label="Fuente" value={selectedLead.source === 'web' ? 'Chat web' : 'WhatsApp'} />
                <InfoRow label="Fecha" value={new Date(selectedLead.createdAt).toLocaleString('es')} />

                {/* Status changer */}
                <div>
                  <label className="block text-xs text-text-soft mb-1">Estado</label>
                  <select
                    value={selectedLead.status}
                    onChange={e => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                    className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-blue"
                  >
                    {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-xs text-text-soft mb-1">Resumen de conversación</label>
                  <p className="text-sm text-text bg-bg rounded-xl p-3">{selectedLead.conversationSummary || 'Sin resumen'}</p>
                </div>

                {/* Quote data */}
                {selectedLead.quoteData && Object.keys(selectedLead.quoteData).length > 0 && (
                  <div>
                    <label className="block text-xs text-text-soft mb-1">Datos de cotización</label>
                    <div className="bg-bg rounded-xl p-3 space-y-1">
                      {Object.entries(selectedLead.quoteData).map(([k, v]) => (
                        <p key={k} className="text-xs text-text"><span className="text-text-mid capitalize">{k}:</span> {v}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-xs text-text-soft mb-1">Notas</label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-blue resize-none"
                    placeholder="Agrega notas sobre este lead..."
                  />
                  <button
                    onClick={() => handleSaveNotes(selectedLead.id)}
                    className="mt-2 px-4 py-1.5 bg-blue text-white text-xs rounded-lg hover:bg-blue-mid transition"
                  >
                    Guardar notas
                  </button>
                </div>

                {/* WhatsApp button */}
                <a
                  href={`https://wa.me/57${selectedLead.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${selectedLead.name}, te contacto de ${agencyName} sobre tu consulta de seguro de ${selectedLead.insuranceType}. ¿Tienes un momento para conversar?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition font-medium"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Abrir WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddForm && <AddLeadModal onClose={() => { setShowAddForm(false); setLeads(getLeads()) }} />}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-text-soft">{label}</span>
      <p className="text-sm text-text">{value}</p>
    </div>
  )
}

function AddLeadModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [insuranceType, setInsuranceType] = useState<InsuranceType>('auto')
  const [urgency, setUrgency] = useState<UrgencyLevel>('este_mes')
  const [summary, setSummary] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !whatsapp.trim()) return
    createLead({
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim() || undefined,
      insuranceType,
      urgency,
      conversationSummary: summary.trim() || 'Lead agregado manualmente',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="font-title text-lg font-bold text-text mb-4">Agregar lead manual</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre completo *" required className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-blue" />
          <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="WhatsApp *" required className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-blue" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (opcional)" className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-blue" />
          <select value={insuranceType} onChange={e => setInsuranceType(e.target.value as InsuranceType)} className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-blue">
            <option value="auto">Seguro de Auto</option><option value="vida">Seguro de Vida</option><option value="salud">Seguro de Salud</option><option value="hogar">Seguro de Hogar</option><option value="otro">Otro</option>
          </select>
          <select value={urgency} onChange={e => setUrgency(e.target.value as UrgencyLevel)} className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-blue">
            <option value="esta_semana">Esta semana</option><option value="este_mes">Este mes</option><option value="explorando">Explorando</option>
          </select>
          <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Notas / resumen" rows={2} className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-blue resize-none" />
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 py-2.5 bg-blue text-white rounded-xl text-sm font-medium hover:bg-blue-mid transition">Guardar</button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-border text-text-mid rounded-xl text-sm hover:border-blue transition">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
