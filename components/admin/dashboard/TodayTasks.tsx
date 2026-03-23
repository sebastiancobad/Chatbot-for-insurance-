'use client'

import type { Lead } from '@/lib/types'
import { getConfig } from '@/lib/store'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

interface TaskItem {
  lead: Lead
  priority: 'urgent' | 'followup' | 'scheduled'
  reason: string
}

interface Props {
  leads: Lead[]
}

export default function TodayTasks({ leads }: Props) {
  const agencyName = getConfig().name
  const now = Date.now()
  const tasks: TaskItem[] = []

  leads.forEach(lead => {
    const age = now - new Date(lead.createdAt).getTime()
    const hours = age / (1000 * 60 * 60)

    // New leads > 2 hours without contact → urgent
    if (lead.status === 'nuevo' && hours > 2) {
      tasks.push({ lead, priority: 'urgent', reason: `Sin contactar · ${timeAgo(lead.createdAt)}` })
    }
    // Quoted leads > 48h without follow-up
    else if (lead.status === 'cotizado' && hours > 48) {
      tasks.push({ lead, priority: 'followup', reason: `Cotizado sin seguimiento · ${timeAgo(lead.createdAt)}` })
    }
    // Scheduled follow-ups for today
    else if (lead.followUpAt) {
      const followUp = new Date(lead.followUpAt)
      const today = new Date()
      if (followUp.toDateString() === today.toDateString()) {
        tasks.push({ lead, priority: 'scheduled', reason: 'Seguimiento programado para hoy' })
      }
    }
    // New leads < 2 hours
    else if (lead.status === 'nuevo') {
      tasks.push({ lead, priority: 'urgent', reason: `Nuevo · ${timeAgo(lead.createdAt)}` })
    }
  })

  // Sort: urgent first, then followup, then scheduled
  tasks.sort((a, b) => {
    const order = { urgent: 0, followup: 1, scheduled: 2 }
    return order[a.priority] - order[b.priority]
  })

  const priorityConfig = {
    urgent: { dot: 'bg-red-500', bg: 'bg-red-50 border-red-100' },
    followup: { dot: 'bg-yellow-500', bg: 'bg-yellow-50 border-yellow-100' },
    scheduled: { dot: 'bg-blue', bg: 'bg-blue-light border-blue/20' },
  }

  const TYPE_LABELS: Record<string, string> = {
    auto: 'Auto', vida: 'Vida', salud: 'Salud', hogar: 'Hogar',
    accidentes: 'Accidentes', empresarial: 'Empresarial', otro: 'Otro',
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-text text-sm mb-4">Tareas del día</h3>
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-teal-light rounded-full flex items-center justify-center mx-auto mb-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00936C" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-sm text-text-mid font-medium">Todo al día</p>
          <p className="text-xs text-text-soft">No tienes pendientes por ahora.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text text-sm">Tareas del día</h3>
        <span className="text-xs text-text-soft">{tasks.length} pendiente{tasks.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="space-y-2">
        {tasks.slice(0, 8).map(task => {
          const cfg = priorityConfig[task.priority]
          const waMsg = encodeURIComponent(
            `Hola ${task.lead.name}, te contacto de ${agencyName} sobre tu consulta de seguro de ${task.lead.insuranceType.toLowerCase()}. ¿Tienes un momento para hablar?`
          )
          return (
            <div key={task.lead.id} className={`flex items-center justify-between p-3 rounded-xl border ${cfg.bg}`}>
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text truncate">{task.lead.name}</p>
                  <p className="text-xs text-text-soft">
                    {TYPE_LABELS[task.lead.insuranceType] || task.lead.insuranceType} · {task.reason}
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/57${task.lead.whatsapp.replace(/\D/g, '')}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 ml-2 px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition font-medium"
              >
                WhatsApp
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
