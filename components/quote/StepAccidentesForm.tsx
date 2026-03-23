'use client'

import { useState } from 'react'
import { RadioGroup, NumberField } from './QuoteFormFields'

interface Props {
  data: Record<string, string>
  onNext: (data: Record<string, string>) => void
  onBack: () => void
}

export default function StepAccidentesForm({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState<Record<string, string>>(data)

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const allAnswered = form.edad && form.ocupacion && form.deportes_riesgo && form.capital_asegurado

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <NumberField label="¿Cuántos años tienes?" value={form.edad || ''} onChange={v => set('edad', v)} min={18} max={65} placeholder="Ej: 30" />
      <RadioGroup label="¿Cuál es tu ocupación principal?" name="ocupacion" value={form.ocupacion || ''} onChange={v => set('ocupacion', v)} options={['Oficina/Administrativo', 'Trabajo de campo/manual', 'Conductor', 'Deportes/actividad física', 'Otro']} />
      <RadioGroup label="¿Practicas deportes de alto riesgo?" name="deportes_riesgo" value={form.deportes_riesgo || ''} onChange={v => set('deportes_riesgo', v)} options={['No', 'Sí (motociclismo, ciclismo montaña, etc.)']} />
      <RadioGroup label="¿Cuánto capital asegurado buscas?" name="capital_asegurado" value={form.capital_asegurado || ''} onChange={v => set('capital_asegurado', v)} options={['$50M', '$100M', '$200M', 'Más de $200M']} />

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 py-3 border-2 border-border rounded-xl text-sm font-medium text-text-mid hover:bg-gray-50 transition">Anterior</button>
        <button onClick={() => allAnswered && onNext(form)} disabled={!allAnswered} className="flex-1 py-3 bg-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-mid transition disabled:opacity-40 disabled:cursor-not-allowed">Siguiente</button>
      </div>
    </div>
  )
}
