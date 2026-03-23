'use client'

import { useState } from 'react'
import { RadioGroup } from './QuoteFormFields'

interface Props {
  data: Record<string, string>
  onNext: (data: Record<string, string>) => void
  onBack: () => void
}

export default function StepHogarForm({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState<Record<string, string>>(data)

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const allAnswered = form.propiedad && form.tipo_inmueble && form.valor_inmueble && form.valor_contenido && form.zona_riesgo

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <RadioGroup label="¿Eres...?" name="propiedad" value={form.propiedad || ''} onChange={v => set('propiedad', v)} options={['Propietario', 'Arrendatario']} />
      <RadioGroup label="¿Qué tipo de inmueble es?" name="tipo_inmueble" value={form.tipo_inmueble || ''} onChange={v => set('tipo_inmueble', v)} options={['Apartamento', 'Casa', 'Local comercial']} />
      <RadioGroup label="¿Cuánto vale aproximadamente el inmueble?" name="valor_inmueble" value={form.valor_inmueble || ''} onChange={v => set('valor_inmueble', v)} options={['Menos de $150M', '$150M - $300M', '$300M - $500M', 'Más de $500M']} />
      <RadioGroup label="¿Cuánto valen tus muebles y electrodomésticos?" name="valor_contenido" value={form.valor_contenido || ''} onChange={v => set('valor_contenido', v)} options={['Menos de $20M', '$20M - $50M', 'Más de $50M']} />
      <RadioGroup label="¿El inmueble está en zona de alto riesgo sísmico?" name="zona_riesgo" value={form.zona_riesgo || ''} onChange={v => set('zona_riesgo', v)} options={['No sé', 'Sí', 'No']} />

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 py-3 border-2 border-border rounded-xl text-sm font-medium text-text-mid hover:bg-gray-50 transition">Anterior</button>
        <button onClick={() => allAnswered && onNext(form)} disabled={!allAnswered} className="flex-1 py-3 bg-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-mid transition disabled:opacity-40 disabled:cursor-not-allowed">Siguiente</button>
      </div>
    </div>
  )
}
