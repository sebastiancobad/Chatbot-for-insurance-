'use client'

import { useState } from 'react'
import { RadioGroup, SelectField } from './QuoteFormFields'

interface Props {
  data: Record<string, string>
  onNext: (data: Record<string, string>) => void
  onBack: () => void
}

const AGES = Array.from({ length: 58 }, (_, i) => {
  const a = String(18 + i)
  return { label: `${a} años`, value: a }
})

export default function StepSaludForm({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState<Record<string, string>>(data)

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const allAnswered = form.cobertura_para && form.edad_mayor && form.preexistencias && form.prioridad && form.medicamentos

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <RadioGroup label="¿El seguro es para...?" name="cobertura_para" value={form.cobertura_para || ''} onChange={v => set('cobertura_para', v)} options={['Solo para mí', 'Para mí y mi pareja', 'Familia completa']} />
      <SelectField label="¿Cuántos años tiene la persona de mayor edad?" value={form.edad_mayor || ''} onChange={v => set('edad_mayor', v)} options={AGES} placeholder="Selecciona edad" />
      <RadioGroup label="¿Tienes enfermedades preexistentes?" name="preexistencias" value={form.preexistencias || ''} onChange={v => set('preexistencias', v)} options={['No', 'Sí']} />
      <RadioGroup label="¿Qué te importa más?" name="prioridad" value={form.prioridad || ''} onChange={v => set('prioridad', v)} options={['Cobertura amplia', 'Prima baja', 'Equilibrio entre ambos']} />
      <RadioGroup label="¿Usas medicamentos crónicos?" name="medicamentos" value={form.medicamentos || ''} onChange={v => set('medicamentos', v)} options={['No', 'Sí']} />

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 py-3 border-2 border-border rounded-xl text-sm font-medium text-text-mid hover:bg-gray-50 transition">Anterior</button>
        <button onClick={() => allAnswered && onNext(form)} disabled={!allAnswered} className="flex-1 py-3 bg-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-mid transition disabled:opacity-40 disabled:cursor-not-allowed">Siguiente</button>
      </div>
    </div>
  )
}
