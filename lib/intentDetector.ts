import type { Message, InsuranceIntent, InsuranceType } from './types'

const PURCHASE_KEYWORDS = [
  'precio', 'costo', 'cuánto', 'cuanto', 'cotización', 'cotizacion', 'cotizar',
  'quiero', 'me interesa', 'contratar', 'comprar', 'adquirir',
  'cuánto vale', 'cuanto vale', 'qué precio', 'que precio',
  'cuánto cuesta', 'cuanto cuesta', 'presupuesto'
]

const COMPARISON_KEYWORDS = [
  'mejor', 'diferencia', 'compara', 'comparar', 'versus', ' vs ',
  'conviene más', 'conviene mas', 'cuál elijo', 'cual elijo',
  'recomiendas', 'cuál es mejor', 'cual es mejor', 'qué conviene', 'que conviene'
]

const INSURANCE_TYPES: Record<InsuranceType, string[]> = {
  auto: ['auto', 'carro', 'coche', 'vehículo', 'vehiculo', 'moto', 'automóvil', 'automovil', 'soat'],
  vida: ['vida', 'fallecimiento', 'muerte', 'beneficiarios', 'deceso'],
  salud: ['salud', 'médico', 'medico', 'hospital', 'enfermedad', 'medicina', 'clínica', 'clinica'],
  hogar: ['hogar', 'casa', 'apartamento', 'vivienda', 'inmueble'],
  accidentes: ['accidente', 'accidentes', 'invalidez', 'personal'],
  empresarial: ['empresa', 'empresarial', 'negocio', 'empleados', 'pyme', 'colectivo'],
  otro: []
}

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function detectInsuranceType(text: string): InsuranceType | null {
  const norm = normalize(text)
  const types: InsuranceType[] = ['auto', 'vida', 'salud', 'hogar', 'accidentes', 'empresarial']
  for (const type of types) {
    const keywords = INSURANCE_TYPES[type]
    if (keywords.some(kw => norm.includes(normalize(kw)))) {
      return type
    }
  }
  return null
}

export function detectIntent(messages: Message[]): InsuranceIntent {
  const result: InsuranceIntent = {
    hasPurchaseIntent: false,
    insuranceType: null,
    wantsComparison: false,
    wantsQuote: false
  }

  // Analyze last 4 user messages
  const userMessages = messages
    .filter(m => m.role === 'user')
    .slice(-4)

  if (userMessages.length === 0) return result

  const lastMsg = normalize(userMessages[userMessages.length - 1].content)
  const allText = userMessages.map(m => normalize(m.content)).join(' ')

  // Detect insurance type from all recent messages
  for (const msg of [...userMessages].reverse()) {
    const type = detectInsuranceType(msg.content)
    if (type) {
      result.insuranceType = type
      break
    }
  }

  // Detect purchase intent
  result.hasPurchaseIntent = PURCHASE_KEYWORDS.some(kw => lastMsg.includes(normalize(kw)))

  // Detect comparison intent
  result.wantsComparison = COMPARISON_KEYWORDS.some(kw => lastMsg.includes(normalize(kw)))

  // Detect quote intent
  const quoteKeywords = ['cotizar', 'cotización', 'cotizacion', 'precio', 'costo', 'cuánto cuesta', 'cuanto cuesta', 'presupuesto']
  result.wantsQuote = quoteKeywords.some(kw => lastMsg.includes(normalize(kw)))

  // Count questions per insurance type - if 2+ about same type, mark purchase intent
  const typeCounts: Record<string, number> = {}
  for (const msg of userMessages) {
    const type = detectInsuranceType(msg.content)
    if (type) {
      typeCounts[type] = (typeCounts[type] || 0) + 1
    }
  }
  const maxCount = Math.max(0, ...Object.values(typeCounts))
  if (maxCount >= 2 && !result.hasPurchaseIntent) {
    result.hasPurchaseIntent = true
    if (!result.insuranceType) {
      result.insuranceType = Object.entries(typeCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] as InsuranceType || null
    }
  }

  return result
}

export function getInsuranceTypeLabel(type: InsuranceType): string {
  const labels: Record<InsuranceType, string> = {
    auto: 'Auto',
    vida: 'Vida',
    salud: 'Salud',
    hogar: 'Hogar',
    accidentes: 'Accidentes',
    empresarial: 'Empresarial',
    otro: 'Otro'
  }
  return labels[type]
}
