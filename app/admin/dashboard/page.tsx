'use client'

import { useState, useEffect } from 'react'
import { getLeads, getLeadsToday, getLeadsThisMonth } from '@/lib/leadStore'
import type { Lead, InsuranceType } from '@/lib/types'
import MetricCard from '@/components/admin/dashboard/MetricCard'
import LeadsChart from '@/components/admin/dashboard/LeadsChart'
import DistributionChart from '@/components/admin/dashboard/DistributionChart'
import TodayTasks from '@/components/admin/dashboard/TodayTasks'
import RecentLeads from '@/components/admin/dashboard/RecentLeads'

const TYPE_LABELS: Record<string, string> = {
  auto: 'Auto', vida: 'Vida', salud: 'Salud', hogar: 'Hogar',
  accidentes: 'Accidentes', empresarial: 'Empresarial', otro: 'Otro',
}

const TYPE_COLORS: Record<string, string> = {
  auto: '#004A8F', vida: '#7C3AED', salud: '#00936C', hogar: '#EA580C',
  accidentes: '#6366F1', empresarial: '#374151', otro: '#9CA3AF',
}

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([])

  useEffect(() => {
    setLeads(getLeads())
    const interval = setInterval(() => setLeads(getLeads()), 30000)
    return () => clearInterval(interval)
  }, [])

  const leadsThisMonth = getLeadsThisMonth()
  const leadsToday = getLeadsToday()
  const nuevos = leads.filter(l => l.status === 'nuevo')
  const cotizados = leads.filter(l => l.status === 'cotizado')
  const cerradosThisMonth = leadsThisMonth.filter(l => l.status === 'cerrado')
  const conversionRate = leadsThisMonth.length > 0
    ? Math.round((cerradosThisMonth.length / leadsThisMonth.length) * 100)
    : 0

  // Distribution by type
  const typeCounts: Record<string, number> = {}
  leads.forEach(l => { typeCounts[l.insuranceType] = (typeCounts[l.insuranceType] || 0) + 1 })
  const distributionData = Object.entries(typeCounts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({
      type,
      label: TYPE_LABELS[type] || type,
      count,
      color: TYPE_COLORS[type] || '#9CA3AF',
    }))

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
    weekData.push({ label: i === 0 ? 'Esta sem.' : `Sem ${4 - i}`, count })
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Leads este mes"
          value={leadsThisMonth.length}
          color="bg-blue-light"
          textColor="text-blue"
          href="/admin/leads"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>}
        />
        <MetricCard
          title="Nuevos hoy"
          value={leadsToday.length}
          color="bg-teal-light"
          textColor="text-teal"
          href="/admin/leads?status=nuevo"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>}
        />
        <MetricCard
          title="Cotizados pendientes"
          value={cotizados.length}
          color="bg-purple-50"
          textColor="text-purple-700"
          href="/admin/leads?status=cotizado"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        />
        <MetricCard
          title="Cerrados este mes"
          value={cerradosThisMonth.length}
          subtitle={conversionRate > 0 ? `${conversionRate}% conversión` : undefined}
          color="bg-green-50"
          textColor="text-green-700"
          href="/admin/leads?status=cerrado"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadsChart data={weekData} />
        <DistributionChart data={distributionData} total={leads.length} />
      </div>

      {/* Tasks + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayTasks leads={leads} />
        <RecentLeads leads={leads} />
      </div>
    </div>
  )
}
