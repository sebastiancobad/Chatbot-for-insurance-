'use client'

import { useState } from 'react'
import type { Plan } from '@/lib/quote-engine'
import type { ContactData } from './StepContact'
import PlanCard from './PlanCard'

const RAMO_LABELS: Record<string, string> = {
  auto: 'Auto', vida: 'Vida', salud: 'Salud', hogar: 'Hogar', accidentes: 'Accidentes Personales', empresarial: 'Empresarial',
}

interface Props {
  plans: Plan[]
  contactData: ContactData
  insuranceType: string
  onSelectPlan: (plan: Plan) => void
  onRestart: () => void
}

export default function QuoteResult({ plans, contactData, insuranceType, onSelectPlan, onRestart }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const ramoLabel = RAMO_LABELS[insuranceType] || insuranceType

  function handleSelect(plan: Plan) {
    setSelectedPlan(plan)
  }

  function handleConfirm() {
    if (selectedPlan) {
      onSelectPlan(selectedPlan)
      setConfirmed(true)
    }
  }

  const waMessage = encodeURIComponent(
    `Hola, acabo de cotizar un seguro de ${ramoLabel} en su página web. Mi nombre es ${contactData.name}. Me interesa el plan ${selectedPlan?.name || 'Recomendado'}. ¿Me pueden dar más información?`
  )

  if (confirmed) {
    return (
      <div className="max-w-lg mx-auto text-center py-8">
        <div className="w-16 h-16 bg-teal-light rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00936C" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-title text-2xl font-bold text-text mb-2">
          ¡Perfecto, {contactData.name.split(' ')[0]}!
        </h2>
        <p className="text-text-mid mb-6">
          Nuestra asesora te contactará en las próximas horas al <strong>{contactData.whatsapp}</strong> para confirmar los valores exactos de tu plan <strong>{selectedPlan?.name}</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://wa.me/573000000000?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
            Escribir por WhatsApp
          </a>
          <button onClick={onRestart} className="px-6 py-3 border-2 border-border rounded-xl text-text-mid font-medium hover:bg-gray-50 transition">
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-light rounded-full mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00936C" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-teal text-sm font-medium">¡Tu cotización está lista!</span>
        </div>
        <h2 className="font-title text-2xl md:text-3xl font-bold text-text mb-1">
          {contactData.name.split(' ')[0]}, estas son tus opciones
        </h2>
        <p className="text-text-mid">Seguro de <strong>{ramoLabel}</strong> — 3 planes para comparar</p>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {plans.map(plan => (
          <PlanCard key={plan.id} plan={plan} onSelect={handleSelect} />
        ))}
      </div>

      {/* Confirm modal */}
      {selectedPlan && !confirmed && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="font-title text-xl font-bold text-text mb-2">Confirmar selección</h3>
            <p className="text-text-mid text-sm mb-4">
              Has elegido el plan <strong>{selectedPlan.name}</strong> de <strong>{selectedPlan.insurer}</strong> por <strong>{selectedPlan.priceLabel}</strong>.
            </p>
            <p className="text-text-soft text-xs mb-5">
              Nuestra asesora te contactará para confirmar valores exactos y resolver cualquier duda.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setSelectedPlan(null)} className="flex-1 py-2.5 border border-border rounded-xl text-sm text-text-mid hover:bg-gray-50 transition">
                Cambiar
              </button>
              <button onClick={handleConfirm} className="flex-1 py-2.5 bg-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-mid transition">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-amber-700 text-xs text-center">
          Estas son estimaciones orientativas basadas en tu perfil. Tu asesora te contactará hoy para confirmar los valores exactos con cada aseguradora.
        </p>
      </div>

      {/* WhatsApp CTA */}
      <div className="text-center border-t border-border pt-6">
        <p className="text-text-mid text-sm mb-3">¿Prefieres que te contactemos directamente?</p>
        <a
          href={`https://wa.me/573000000000?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
          Abrir WhatsApp
        </a>
      </div>

      {/* Restart */}
      <div className="text-center mt-4">
        <button onClick={onRestart} className="text-sm text-text-soft hover:text-blue transition">
          Recotizar
        </button>
      </div>
    </div>
  )
}
