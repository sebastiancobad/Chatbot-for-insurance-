'use client'

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { getLeads, updateLead, markLeadsAsViewed, createLead } from '@/lib/leadStore'
import { getConfig } from '@/lib/store'
import type { Lead, LeadStatus, InsuranceType, UrgencyLevel } from '@/lib/types'
import LeadDetail from '@/components/admin/leads/LeadDetail'
import ExportButton from '@/components/admin/leads/ExportButton'

const STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: 'Nuevo', contactado: 'Contactado', cotizado: 'Cotizado',
  negociando: 'Negociando', cerrado: 'Cerrado', perdido: 'Perdido',
}
const STATUS_COLORS: Record<LeadStatus, string> = {
  nuevo: 'bg-blue-light text-blue', contactado: 'bg-yellow-50 text-yellow-700',
  cotizado: 'bg-purple-50 text-purple-700', negociando: 'bg-orange-50 text-orange-700',
  cerrado: 'bg-green-50 text-green-700', perdido: 'bg-red-50 text-red-500',
}
const TYPE_LABELS: Record<string, string> = {
  auto: 'Auto', vida: 'Vida', salud: 'Salud', hogar: 'Hogar',
  accidentes: 'Accidentes', empresarial: 'Empresarial', otro: 'Otro',
}
const URGENCY_LABELS: Record<string, string> = {
  esta_semana: 'Esta sem.', este_mes: 'Este mes', explorando: 'Explorando',
}

const PAGE_SIZE = 20

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="text-center py-16"><div className="w-8 h-8 border-3 border-blue border-t-transparent rounded-full animate-spin mx-auto" /></div>}>
      <LeadsPageContent />
    </Suspense>
  )
}

function LeadsPageContent() {
  const searchParams = useSearchParams()
  const urlStatus = searchParams.get('status') as LeadStatus | null
  const urlSelected = searchParams.get('selected')

  const [leads, setLeads] = useState<Lead[]>([])
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>(urlStatus || 'all')
  const [filterType, setFilterType] = useState<InsuranceType | 'all'>('all')
  const [filterUrgency, setFilterUrgency] = useState<UrgencyLevel | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    refreshLeads()
    markLeadsAsViewed()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (urlSelected && leads.length > 0) {
      const lead = leads.find(l => l.id === urlSelected)
      if (lead) setSelectedLead(lead)
    }
  }, [urlSelected, leads])

  function refreshLeads() {
    const all = getLeads()
    setLeads(all)
    // Update selected lead if open
    if (selectedLead) {
      const updated = all.find(l => l.id === selectedLead.id)
      if (updated) setSelectedLead(updated)
    }
  }

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (filterStatus !== 'all' && l.status !== filterStatus) return false
      if (filterType !== 'all' && l.insuranceType !== filterType) return false
      if (filterUrgency !== 'all' && l.urgency !== filterUrgency) return false
      if (search) {
        const s = search.toLowerCase()
        if (!l.name.toLowerCase().includes(s) && !l.whatsapp.includes(s) && !(l.email || '').toLowerCase().includes(s)) return false
      }
      return true
    })
  }, [leads, filterStatus, filterType, filterUrgency, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Status counts for tabs
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length }
    leads.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1 })
    return counts
  }, [leads])

  const agencyName = getConfig().name

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-title text-xl font-bold text-text">Gestión de Leads</h2>
          <p className="text-sm text-text-soft">{filtered.length} lead{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-blue text-white rounded-xl text-sm font-medium hover:bg-blue-mid transition">
            + Agregar
          </button>
          <ExportButton leads={filtered} />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Todos' },
          { key: 'nuevo', label: 'Nuevos' },
          { key: 'contactado', label: 'Contactados' },
          { key: 'cotizado', label: 'Cotizados' },
          { key: 'negociando', label: 'Negociando' },
          { key: 'cerrado', label: 'Cerrados' },
          { key: 'perdido', label: 'Perdidos' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setFilterStatus(tab.key as LeadStatus | 'all'); setPage(1) }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              filterStatus === tab.key
                ? 'bg-blue text-white'
                : 'bg-white text-text-mid hover:bg-blue-light hover:text-blue border border-border'
            }`}
          >
            {tab.label}
            {(statusCounts[tab.key] || 0) > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filterStatus === tab.key ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {statusCounts[tab.key] || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={filterType}
          onChange={e => { setFilterType(e.target.value as InsuranceType | 'all'); setPage(1) }}
          className="px-3 py-2 border border-border rounded-xl text-sm text-text-mid focus:outline-none focus:border-blue bg-white"
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
          onChange={e => { setFilterUrgency(e.target.value as UrgencyLevel | 'all'); setPage(1) }}
          className="px-3 py-2 border border-border rounded-xl text-sm text-text-mid focus:outline-none focus:border-blue bg-white"
        >
          <option value="all">Toda urgencia</option>
          <option value="esta_semana">Esta semana</option>
          <option value="este_mes">Este mes</option>
          <option value="explorando">Explorando</option>
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A99AF" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar por nombre, WhatsApp o email..."
            className="w-full pl-9 pr-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:border-blue bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 text-text-mid font-medium text-xs uppercase tracking-wider">Nombre</th>
                <th className="text-left px-4 py-3 text-text-mid font-medium text-xs uppercase tracking-wider hidden sm:table-cell">WhatsApp</th>
                <th className="text-left px-4 py-3 text-text-mid font-medium text-xs uppercase tracking-wider">Ramo</th>
                <th className="text-left px-4 py-3 text-text-mid font-medium text-xs uppercase tracking-wider hidden md:table-cell">Urgencia</th>
                <th className="text-left px-4 py-3 text-text-mid font-medium text-xs uppercase tracking-wider">Estado</th>
                <th className="text-left px-4 py-3 text-text-mid font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Fecha</th>
                <th className="text-left px-4 py-3 text-text-mid font-medium text-xs uppercase tracking-wider w-10"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-text-soft">No hay leads que coincidan con los filtros</td></tr>
              ) : paginated.map(lead => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`border-b border-border/50 cursor-pointer hover:bg-blue-light/30 transition ${
                    lead.urgency === 'esta_semana' && lead.status === 'nuevo' ? 'bg-yellow-50/50' : ''
                  } ${selectedLead?.id === lead.id ? 'bg-blue-light/50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-blue-light rounded-full flex items-center justify-center text-blue text-xs font-bold flex-shrink-0">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-text truncate">{lead.name}</p>
                        <p className="text-xs text-text-soft sm:hidden">{lead.whatsapp}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-mid hidden sm:table-cell">{lead.whatsapp}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-blue-light text-blue text-xs rounded-full font-medium">
                      {TYPE_LABELS[lead.insuranceType] || lead.insuranceType}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs font-medium ${lead.urgency === 'esta_semana' ? 'text-red-500' : 'text-text-soft'}`}>
                      {URGENCY_LABELS[lead.urgency] || lead.urgency}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_COLORS[lead.status]}`}>
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-soft text-xs hidden lg:table-cell whitespace-nowrap">
                    {timeAgo(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://wa.me/57${lead.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${lead.name}, te contacto de ${agencyName} sobre tu consulta de seguro de ${(TYPE_LABELS[lead.insuranceType] || '').toLowerCase()}. ¿Tienes un momento?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="p-1.5 text-green-500 hover:text-green-700 transition"
                      title="Abrir WhatsApp"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                      </svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-bg/50">
            <span className="text-xs text-text-soft">
              Mostrando {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-xs border border-border rounded-lg hover:bg-white transition disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-xs border border-border rounded-lg hover:bg-white transition disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Side Panel */}
      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={refreshLeads}
        />
      )}

      {/* Add Lead Modal */}
      {showAddForm && <AddLeadModal onClose={() => { setShowAddForm(false); refreshLeads() }} />}
    </div>
  )
}

function AddLeadModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [insuranceType, setInsuranceType] = useState<InsuranceType>('auto')
  const [urgency, setUrgency] = useState<UrgencyLevel>('este_mes')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !whatsapp.trim()) return
    createLead({
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim() || undefined,
      insuranceType,
      urgency,
      conversationSummary: notes.trim() || 'Lead agregado manualmente',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <h3 className="font-title text-lg font-bold text-text mb-4">Agregar lead manual</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre completo *" required className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-blue" />
          <input value={whatsapp} onChange={e => setWhatsapp(e.target.value.replace(/[^\d\s]/g, ''))} placeholder="WhatsApp *" required className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-blue" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (opcional)" className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-blue" />
          <input value={city} onChange={e => setCity(e.target.value)} placeholder="Ciudad (opcional)" className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-blue" />
          <select value={insuranceType} onChange={e => setInsuranceType(e.target.value as InsuranceType)} className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-blue">
            <option value="auto">Seguro de Auto</option>
            <option value="vida">Seguro de Vida</option>
            <option value="salud">Seguro de Salud</option>
            <option value="hogar">Seguro de Hogar</option>
            <option value="accidentes">Accidentes Personales</option>
            <option value="empresarial">Empresarial</option>
            <option value="otro">Otro</option>
          </select>
          <select value={urgency} onChange={e => setUrgency(e.target.value as UrgencyLevel)} className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-blue">
            <option value="esta_semana">Esta semana</option>
            <option value="este_mes">Este mes</option>
            <option value="explorando">Explorando</option>
          </select>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notas / resumen" rows={2} className="w-full px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-blue resize-none" />
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 py-2.5 bg-blue text-white rounded-xl text-sm font-medium hover:bg-blue-mid transition">Guardar</button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-border text-text-mid rounded-xl text-sm hover:border-blue transition">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
