'use client'

import { useState } from 'react'
import { RadioGroup, CheckboxGroup } from './QuoteFormFields'

interface Props {
  data: Record<string, string | string[]>
  onNext: (data: Record<string, string | string[]>) => void
  onBack: () => void
}

export default function StepEmpresarialForm({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState<Record<string, string | string[]>>(data)

  function set(key: string, val: string | string[]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  const necesidades = Array.isArray(form.necesidades) ? form.necesidades : []
  const allAnswered = form.num_empleados && form.tipo_empresa && necesidades.length > 0 && form.presupuesto

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <RadioGroup label="¿Cuántos empleados tiene tu empresa?" name="num_empleados" value={String(form.num_empleados || '')} onChange={v => set('num_empleados', v)} options={['1-5', '6-20', '21-50', 'Más de 50']} />
      <RadioGroup label="¿Qué tipo de empresa es?" name="tipo_empresa" value={String(form.tipo_empresa || '')} onChange={v => set('tipo_empresa', v)} options={['Comercio', 'Servicios', 'Manufactura', 'Construcción', 'Otro']} />
      <CheckboxGroup label="¿Qué necesitas asegurar?" options={['Vida/salud para empleados', 'Instalaciones y equipos', 'Vehículos', 'Responsabilidad civil', 'Mercancías en tránsito']} value={necesidades} onChange={v => set('necesidades', v)} />
      <RadioGroup label="¿Cuál es el presupuesto mensual aproximado?" name="presupuesto" value={String(form.presupuesto || '')} onChange={v => set('presupuesto', v)} options={['Menos de $500K', '$500K - $2M', 'Más de $2M']} />

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 py-3 border-2 border-border rounded-xl text-sm font-medium text-text-mid hover:bg-gray-50 transition">Anterior</button>
        <button onClick={() => allAnswered && onNext(form)} disabled={!allAnswered} className="flex-1 py-3 bg-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-mid transition disabled:opacity-40 disabled:cursor-not-allowed">Siguiente</button>
      </div>
    </div>
  )
}
