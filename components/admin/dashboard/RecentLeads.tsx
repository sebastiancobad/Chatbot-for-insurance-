'use client'

import type { Lead } from '@/lib/types'

const STATUS_LABELS: Record<string, string> = {
  nuevo: 'Nuevo', contactado: 'Contactado', cotizado: 'Cotizado',
  negociando: 'Negociando', cerrado: 'Cerrado', perdido: 'Perdido',
}

const STATUS_COLORS: Record<string, string> = {
  nuevo: 'bg-blue-light text-blue', contactado: 'bg-yellow-50 text-yellow-700',
  cotizado: 'bg-purple-50 text-purple-700', negociando: 'bg-orange-50 text-orange-700',
  cerrado: 'bg-green-50 text-green-700', perdido: 'bg-red-50 text-red-500',
}

const TYPE_LABELS: Record<string, string> = {
  auto: 'Auto', vida: 'Vida', salud: 'Salud', hogar: 'Hogar',
  accidentes: 'Accidentes', empresarial: 'Empresarial', otro: 'Otro',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

interface Props {
  leads: Lead[]
}

export default function RecentLeads({ leads }: Props) {
  const recent = leads.slice(0, 5)

  return (
    <div className="bg-white rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text text-sm">Últimos leads</h3>
        <a href="/admin/leads" className="text-xs text-blue hover:text-blue-mid font-medium transition">
          Ver todos
        </a>
      </div>
      {recent.length === 0 ? (
        <p className="text-text-soft text-sm text-center py-4">No hay leads aún</p>
      ) : (
        <div className="space-y-2">
          {recent.map(lead => (
            <a
              key={lead.id}
              href={`/admin/leads?selected=${lead.id}`}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-bg transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-blue-light rounded-full flex items-center justify-center text-blue text-xs font-bold flex-shrink-0">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text truncate">{lead.name}</p>
                  <p className="text-xs text-text-soft">{TYPE_LABELS[lead.insuranceType] || lead.insuranceType}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-600'}`}>
                  {STATUS_LABELS[lead.status] || lead.status}
                </span>
                <span className="text-[10px] text-text-soft w-6 text-right">{timeAgo(lead.createdAt)}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
