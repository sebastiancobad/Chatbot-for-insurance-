'use client'

import { useState, useEffect } from 'react'
import { getLeads, getLeadsToday, getLeadsThisMonth, exportLeadsCSV } from '@/lib/leadStore'
import type { Lead, InsuranceType } from '@/lib/types'
import { getInsuranceTypeLabel } from '@/lib/intentDetector'

export default function DashboardMetrics() {
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    setLeads(getLeads())
  }, [])

  const leadsThisMonth = getLeadsThisMonth()
  const leadsToday = getLeadsToday()
  const cotizados = leads.filter(l => l.status === 'cotizado')
  const cerradosThisMonth = leadsThisMonth.filter(l => l.status === 'cerrado')
  const nuevos = leads.filter(l => l.status === 'nuevo')

  // Distribution by type
  const typeCounts: Record<InsuranceType, number> = { auto: 0, vida: 0, salud: 0, hogar: 0, accidentes: 0, empresarial: 0, otro: 0 }
  leads.forEach(l => { typeCounts[l.insuranceType] = (typeCounts[l.insuranceType] || 0) + 1 })
  const totalLeads = leads.length || 1

  // Leads by week (last 4 weeks)
  const weekData: { label: string; count: number }[] = []
  for (let i = 3; i >= 0; i--) {
    const start = new Date()
    start.setDate(start.getDate() - (i + 1) * 7)
    const end = new Date()
    end.setDate(end.getDate() - i * 7)
    const count = leads.filter(l => {
      const d = new Date(l.createdAt)
      return d >= start && d < end
    }).length
    weekData.push({ label: `Sem ${4 - i}`, count })
  }
  const maxWeek = Math.max(1, ...weekData.map(w => w.count))

  // Urgent leads needing contact
  const urgentLeads = nuevos
    .sort((a, b) => {
      const urgencyOrder = { esta_semana: 0, este_mes: 1, explorando: 2 }
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
    })
    .slice(0, 5)

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

  const typeColors: Record<InsuranceType, string> = {
    auto: 'bg-blue', vida: 'bg-purple-500', salud: 'bg-teal', hogar: 'bg-orange-500', accidentes: 'bg-indigo-500', empresarial: 'bg-gray-700', otro: 'bg-gray-400'
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard value={leadsThisMonth.length} label="Leads este mes" color="bg-blue-light" textColor="text-blue" />
        <MetricCard value={leadsToday.length} label="Nuevos hoy" color="bg-teal-light" textColor="text-teal" />
        <MetricCard value={cotizados.length} label="Cotizados pendientes" color="bg-yellow-50" textColor="text-yellow-600" />
        <MetricCard value={cerradosThisMonth.length} label="Cerrados este mes" color="bg-green-50" textColor="text-green-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly chart */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-text text-sm mb-4">Leads por semana</h3>
          <div className="flex items-end gap-3 h-32">
            {weekData.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-text-mid font-medium">{w.count}</span>
                <div
                  className="w-full bg-blue rounded-t-lg transition-all"
                  style={{ height: `${(w.count / maxWeek) * 100}%`, minHeight: w.count > 0 ? '8px' : '2px' }}
                />
                <span className="text-xs text-text-soft">{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution by type */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-text text-sm mb-4">Distribución por ramo</h3>
          <div className="space-y-3">
            {(['auto', 'vida', 'salud', 'hogar'] as InsuranceType[]).map(type => {
              const pct = Math.round((typeCounts[type] / totalLeads) * 100)
              return (
                <div key={type} className="flex items-center gap-3">
                  <span className="text-xs text-text-mid w-12">{getInsuranceTypeLabel(type)}</span>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${typeColors[type]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-text-mid w-10 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pending tasks */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text text-sm">Leads sin contactar</h3>
          <button
            onClick={handleExport}
            className="text-xs text-blue hover:text-blue-mid transition font-medium"
          >
            Exportar CSV
          </button>
        </div>
        {urgentLeads.length === 0 ? (
          <p className="text-text-soft text-sm text-center py-4">No hay leads pendientes de contacto</p>
        ) : (
          <div className="space-y-2">
            {urgentLeads.map(lead => (
              <div
                key={lead.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  lead.urgency === 'esta_semana' ? 'bg-yellow-50 border border-yellow-200' : 'bg-bg'
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-text">{lead.name}</p>
                  <p className="text-xs text-text-soft">
                    {getInsuranceTypeLabel(lead.insuranceType)} · {lead.urgency === 'esta_semana' ? 'Urgente' : lead.urgency === 'este_mes' ? 'Este mes' : 'Explorando'}
                  </p>
                </div>
                <a
                  href={`https://wa.me/57${lead.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${lead.name}, te contacto sobre tu consulta de seguro de ${lead.insuranceType}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition font-medium"
                >
                  WhatsApp
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ value, label, color, textColor }: { value: number; label: string; color: string; textColor: string }) {
  return (
    <div className={`${color} rounded-xl p-4 text-center`}>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      <p className="text-xs text-text-mid mt-1">{label}</p>
    </div>
  )
}
