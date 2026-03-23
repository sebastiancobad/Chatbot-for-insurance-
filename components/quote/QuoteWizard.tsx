'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import type { InsuranceType } from '@/lib/types'
import type { Plan } from '@/lib/quote-engine'
import { generateQuote } from '@/lib/quote-engine'
import { createLead } from '@/lib/leadStore'
import StepIndicator from './StepIndicator'
import StepContact, { type ContactData } from './StepContact'
import StepInsuranceType from './StepInsuranceType'
import StepAutoForm from './StepAutoForm'
import StepVidaForm from './StepVidaForm'
import StepSaludForm from './StepSaludForm'
import StepHogarForm from './StepHogarForm'
import StepAccidentesForm from './StepAccidentesForm'
import StepEmpresarialForm from './StepEmpresarialForm'
import QuoteResult from './QuoteResult'

const VALID_TYPES: InsuranceType[] = ['auto', 'vida', 'salud', 'hogar', 'accidentes', 'empresarial']

const RAMO_LABELS: Record<string, string> = {
  auto: 'Auto', vida: 'Vida', salud: 'Salud', hogar: 'Hogar',
  accidentes: 'Accidentes', empresarial: 'Empresarial',
}

export default function QuoteWizard() {
  const searchParams = useSearchParams()

  // Pre-fill from URL params (chatbot integration)
  const urlTipo = searchParams.get('tipo') as InsuranceType | null
  const urlNombre = searchParams.get('nombre') || ''
  const urlWa = searchParams.get('wa') || ''

  const hasPreselectedType = urlTipo && VALID_TYPES.includes(urlTipo)

  const [contactData, setContactData] = useState<ContactData>({
    name: urlNombre,
    whatsapp: urlWa,
    email: '',
    city: '',
  })
  const [insuranceType, setInsuranceType] = useState<InsuranceType | null>(hasPreselectedType ? urlTipo : null)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [plans, setPlans] = useState<Plan[]>([])
  const [saving, setSaving] = useState(false)

  // Determine current step
  // If type preselected: Contact(1) → RamoForm(2) → Result(3) — 3 steps
  // If no type: Contact(1) → TypeSelect(2) → RamoForm(3) → Result(4) — 4 steps
  const [step, setStep] = useState(1)

  const totalSteps = hasPreselectedType ? 3 : 4
  const stepLabels = hasPreselectedType
    ? ['Datos', 'Info', 'Resultado']
    : ['Datos', 'Tipo', 'Info', 'Resultado']

  // Calculate which logical step maps to which content
  function getContentStep(): 'contact' | 'type' | 'form' | 'result' {
    if (hasPreselectedType) {
      if (step === 1) return 'contact'
      if (step === 2) return 'form'
      return 'result'
    } else {
      if (step === 1) return 'contact'
      if (step === 2) return 'type'
      if (step === 3) return 'form'
      return 'result'
    }
  }

  const contentStep = getContentStep()

  // Auto-skip contact if we have prefilled data from chatbot
  useEffect(() => {
    if (urlNombre && urlWa && urlNombre.length >= 3 && /^\d{7,}$/.test(urlWa.replace(/\s/g, ''))) {
      // Skip contact step
      if (hasPreselectedType) {
        setStep(2) // go to form
      } else {
        setStep(2) // go to type select
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleContactNext(data: ContactData) {
    setContactData(data)
    setStep(step + 1)
  }

  function handleTypeSelect(type: InsuranceType) {
    setInsuranceType(type)
    setStep(step + 1)
  }

  function handleFormNext(data: Record<string, string | string[]>) {
    setAnswers(data)
    // Generate plans
    const generated = generateQuote({
      insuranceType: insuranceType!,
      answers: data,
      contactData,
    })
    setPlans(generated)
    setStep(step + 1)
  }

  function handleFormBack() {
    setStep(step - 1)
  }

  async function handleSelectPlan(plan: Plan) {
    if (saving) return
    setSaving(true)

    try {
      // Build summary
      const summaryParts = Object.entries(answers)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)

      createLead({
        name: contactData.name,
        whatsapp: contactData.whatsapp,
        email: contactData.email || undefined,
        insuranceType: insuranceType || 'otro',
        urgency: 'este_mes',
        conversationSummary: `[Cotizador] ${RAMO_LABELS[insuranceType || '']} — Plan ${plan.name} (${plan.priceLabel}) | ${summaryParts.join(' | ')}`,
      })

      // Also call the API to persist
      await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactData,
          insuranceType,
          answers,
          selectedPlan: { id: plan.id, name: plan.name, price: plan.price, insurer: plan.insurer },
        }),
      }).catch(() => {}) // Non-blocking
    } finally {
      setSaving(false)
    }
  }

  function handleRestart() {
    setStep(1)
    setContactData({ name: '', whatsapp: '', email: '', city: '' })
    setInsuranceType(hasPreselectedType ? urlTipo : null)
    setAnswers({})
    setPlans([])
  }

  // Step title
  const stepTitles: Record<string, string> = {
    contact: 'Tus datos de contacto',
    type: '¿Qué tipo de seguro necesitas?',
    form: `Cuéntanos sobre tu seguro de ${RAMO_LABELS[insuranceType || ''] || ''}`,
    result: 'Tu cotización',
  }

  function renderRamoForm() {
    const props = { data: answers as Record<string, string>, onNext: handleFormNext, onBack: handleFormBack }
    switch (insuranceType) {
      case 'auto': return <StepAutoForm {...props} />
      case 'vida': return <StepVidaForm {...props} />
      case 'salud': return <StepSaludForm {...props} />
      case 'hogar': return <StepHogarForm {...props} />
      case 'accidentes': return <StepAccidentesForm {...props} />
      case 'empresarial': return <StepEmpresarialForm data={answers} onNext={handleFormNext} onBack={handleFormBack} />
      default: return null
    }
  }

  return (
    <div className="min-h-[60vh]">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-title text-3xl md:text-4xl font-bold text-text mb-2">
          {contentStep === 'result' ? '' : stepTitles[contentStep]}
        </h1>
      </div>

      {/* Step indicator */}
      {contentStep !== 'result' && (
        <StepIndicator currentStep={step} totalSteps={totalSteps} labels={stepLabels} />
      )}

      {/* Content */}
      <div className="transition-all">
        {contentStep === 'contact' && (
          <StepContact data={contactData} onNext={handleContactNext} />
        )}
        {contentStep === 'type' && (
          <StepInsuranceType onSelect={handleTypeSelect} />
        )}
        {contentStep === 'form' && renderRamoForm()}
        {contentStep === 'result' && (
          <QuoteResult
            plans={plans}
            contactData={contactData}
            insuranceType={insuranceType || ''}
            onSelectPlan={handleSelectPlan}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  )
}
