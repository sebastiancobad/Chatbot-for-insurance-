'use client'

import type { LeadStatus } from '@/lib/types'

const STATUS_CONFIG: { id: LeadStatus; label: string; color: string; icon: string }[] = [
  { id: 'nuevo', label: 'Nuevo', color: 'bg-blue-light text-blue border-blue/30', icon: '●' },
  { id: 'contactado', label: 'Contactado', color: 'bg-yellow-50 text-yellow-700 border-yellow-300', icon: '📞' },
  { id: 'cotizado', label: 'Cotizado', color: 'bg-purple-50 text-purple-700 border-purple-300', icon: '📋' },
  { id: 'negociando', label: 'Negociando', color: 'bg-orange-50 text-orange-700 border-orange-300', icon: '🤝' },
  { id: 'cerrado', label: 'Cerrado', color: 'bg-green-50 text-green-700 border-green-300', icon: '✓' },
  { id: 'perdido', label: 'Perdido', color: 'bg-red-50 text-red-500 border-red-300', icon: '✗' },
]

interface Props {
  value: LeadStatus
  onChange: (status: LeadStatus) => void
}

export default function LeadStatusSelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as LeadStatus)}
      className="w-full px-3 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
    >
      {STATUS_CONFIG.map(s => (
        <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
      ))}
    </select>
  )
}

export { STATUS_CONFIG }
