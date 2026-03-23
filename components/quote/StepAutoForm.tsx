'use client'

import { useState } from 'react'
import { RadioGroup, SelectField } from './QuoteFormFields'

interface Props {
  data: Record<string, string>
  onNext: (data: Record<string, string>) => void
  onBack: () => void
}

const YEARS = Array.from({ length: 26 }, (_, i) => {
  const y = String(2025 - i)
  return { label: y, value: y }
})

export default function StepAutoForm({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState<Record<string, string>>(data)

  function set(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const allAnswered = form.tipo_vehiculo && form.anio_vehiculo && form.valor_vehiculo && form.uso_vehiculo && form.garaje && form.siniestros

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <RadioGroup label="¿Qué tipo de vehículo es?" name="tipo_vehiculo" value={form.tipo_vehiculo || ''} onChange={v => set('tipo_vehiculo', v)} options={['Automóvil', 'Camioneta/SUV', 'Moto', 'Otro']} />
      <SelectField label="¿Cuál es el año del vehículo?" value={form.anio_vehiculo || ''} onChange={v => set('anio_vehiculo', v)} options={YEARS} placeholder="Selecciona el año" />
      <RadioGroup label="¿Cuál es el valor aproximado del vehículo?" name="valor_vehiculo" value={form.valor_vehiculo || ''} onChange={v => set('valor_vehiculo', v)} options={['Menos de $30M', '$30M - $60M', '$60M - $100M', 'Más de $100M']} />
      <RadioGroup label="¿Para qué usas el vehículo principalmente?" name="uso_vehiculo" value={form.uso_vehiculo || ''} onChange={v => set('uso_vehiculo', v)} options={['Uso personal', 'Trabajo/negocios', 'Transporte de personas']} />
      <RadioGroup label="¿Tienes garaje o estacionamiento seguro?" name="garaje" value={form.garaje || ''} onChange={v => set('garaje', v)} options={['Sí', 'No']} />
      <RadioGroup label="¿Has tenido siniestros en los últimos 2 años?" name="siniestros" value={form.siniestros || ''} onChange={v => set('siniestros', v)} options={['No, ninguno', '1 siniestro', '2 o más']} />

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 py-3 border-2 border-border rounded-xl text-sm font-medium text-text-mid hover:bg-gray-50 transition">Anterior</button>
        <button onClick={() => allAnswered && onNext(form)} disabled={!allAnswered} className="flex-1 py-3 bg-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-mid transition disabled:opacity-40 disabled:cursor-not-allowed">Siguiente</button>
      </div>
    </div>
  )
}
