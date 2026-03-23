'use client'

import type { InsuranceType } from '@/lib/types'

const RAMOS: { id: InsuranceType; name: string; desc: string; price: string; color: string }[] = [
  { id: 'auto', name: 'Auto', desc: 'Protege tu vehículo', price: 'Desde $89.000/mes', color: '#1A6BC4' },
  { id: 'vida', name: 'Vida', desc: 'Protege a tu familia', price: 'Desde $45.000/mes', color: '#00936C' },
  { id: 'salud', name: 'Salud', desc: 'Atención médica de calidad', price: 'Desde $120.000/mes', color: '#E24B4A' },
  { id: 'hogar', name: 'Hogar', desc: 'Protege tu patrimonio', price: 'Desde $35.000/mes', color: '#BA7517' },
  { id: 'accidentes', name: 'Accidentes', desc: 'Protección personal', price: 'Desde $18.000/mes', color: '#534AB7' },
  { id: 'empresarial', name: 'Empresarial', desc: 'Protege tu negocio', price: 'Cotización personalizada', color: '#2C2C2A' },
]

const ICONS: Record<string, JSX.Element> = {
  auto: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 17H3V14L5 6H19L21 14V17H19M5 17L5.5 19H7.5L8 17M5 17H8M19 17L18.5 19H16.5L16 17M19 17H16M8 17H16" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7.5" cy="14" r="1" fill="currentColor"/><circle cx="16.5" cy="14" r="1" fill="currentColor"/></svg>,
  vida: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  salud: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12H18L15 21L9 3L6 12H2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  hogar: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12L12 3L21 12M5 10V20C5 20.55 5.45 21 6 21H9V15H15V21H18C18.55 21 19 20.55 19 20V10" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  accidentes: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  empresarial: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

interface Props {
  onSelect: (type: InsuranceType) => void
}

export default function StepInsuranceType({ onSelect }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-center text-text-mid text-sm mb-6">Selecciona el tipo de seguro que necesitas</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {RAMOS.map(ramo => (
          <button
            key={ramo.id}
            onClick={() => onSelect(ramo.id)}
            className="group flex flex-col items-center text-center p-5 bg-white rounded-2xl border-2 border-border hover:border-blue hover:shadow-md transition-all"
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-colors"
              style={{ backgroundColor: `${ramo.color}15`, color: ramo.color }}
            >
              {ICONS[ramo.id]}
            </div>
            <h3 className="font-semibold text-text text-base mb-0.5">{ramo.name}</h3>
            <p className="text-text-soft text-xs mb-2">{ramo.desc}</p>
            <span className="text-xs font-medium" style={{ color: ramo.color }}>{ramo.price}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
