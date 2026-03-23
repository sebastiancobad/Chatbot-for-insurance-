'use client'

import { useState } from 'react'
import { RadioGroup, NumberField } from './QuoteFormFields'

interface Props {
  data: Record<string, string>
  onNext: (data: Record<string, string>) => void
  onBack: () => void
}

export default function StepVidaForm({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState<Record<string, string>>(data)

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const allAnswered = form.edad && form.fuma && form.condicion_medica && form.monto_cobertura && form.dependientes

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <NumberField label="¿Cuántos años tienes?" value={form.edad || ''} onChange={v => set('edad', v)} min={18} max={70} placeholder="Ej: 35" />
      <RadioGroup label="¿Fumas actualmente?" name="fuma" value={form.fuma || ''} onChange={v => set('fuma', v)} options={['No', 'Sí']} />
      <RadioGroup label="¿Tienes alguna condición médica importante?" name="condicion_medica" value={form.condicion_medica || ''} onChange={v => set('condicion_medica', v)} options={['No', 'Sí (diabetes, hipertensión, etc.)']} />
      <RadioGroup label="¿Qué monto de cobertura buscas?" name="monto_cobertura" value={form.monto_cobertura || ''} onChange={v => set('monto_cobertura', v)} options={['$50M - $100M', '$100M - $300M', '$300M - $500M', 'Más de $500M']} />
      <RadioGroup label="¿Tienes dependientes económicos?" name="dependientes" value={form.dependientes || ''} onChange={v => set('dependientes', v)} options={['Sí, cónyuge e hijos', 'Solo cónyuge', 'Solo hijos', 'No']} />

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 py-3 border-2 border-border rounded-xl text-sm font-medium text-text-mid hover:bg-gray-50 transition">Anterior</button>
        <button onClick={() => allAnswered && onNext(form)} disabled={!allAnswered} className="flex-1 py-3 bg-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-mid transition disabled:opacity-40 disabled:cursor-not-allowed">Siguiente</button>
      </div>
    </div>
  )
}
