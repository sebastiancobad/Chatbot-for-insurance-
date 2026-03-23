'use client'

import { useState } from 'react'
import type { LeadStep } from '@/hooks/useChat'

interface LeadCaptureChipsProps {
  leadStep: LeadStep
  onSubmitName: (name: string) => void
  onSubmitWhatsapp: (whatsapp: string) => void
}

export default function LeadCaptureChips({ leadStep, onSubmitName, onSubmitWhatsapp }: LeadCaptureChipsProps) {
  const [value, setValue] = useState('')

  if (leadStep === 'none' || leadStep === 'done') return null

  const isName = leadStep === 'name'
  const label = isName ? '¿Cuál es tu nombre?' : '¿Tu número de WhatsApp?'
  const placeholder = isName ? 'Tu nombre...' : '3XX XXX XXXX'

  function handleSubmit() {
    if (!value.trim()) return
    if (isName) {
      onSubmitName(value.trim())
    } else {
      onSubmitWhatsapp(value.trim())
    }
    setValue('')
  }

  return (
    <div className="mx-3 mb-2 p-3 bg-blue-light rounded-xl border border-blue/20">
      <p className="text-xs font-medium text-blue mb-2">{label}</p>
      <div className="flex gap-2">
        <input
          type={isName ? 'text' : 'tel'}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder={placeholder}
          className="flex-1 px-3 py-1.5 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue"
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="px-3 py-1.5 bg-blue text-white text-sm font-medium rounded-lg hover:bg-blue-mid transition disabled:opacity-40"
        >
          Enviar
        </button>
      </div>
      {!isName && (
        <p className="text-[10px] text-text-soft mt-1.5">Nuestra asesora te contactará hoy mismo.</p>
      )}
    </div>
  )
}
