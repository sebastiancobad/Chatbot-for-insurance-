export type PlanTier = 'basic' | 'recommended' | 'premium'

export type PlanCoverage = {
  label: string
  included: boolean
}

export type Plan = {
  id: PlanTier
  name: string
  price: number
  priceLabel: string
  coverages: PlanCoverage[]
  isRecommended: boolean
  reasonRecommended?: string
  insurer: string
}

export type QuoteInput = {
  insuranceType: string
  answers: Record<string, string | string[]>
  contactData: { name: string; whatsapp: string; email?: string; city?: string }
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-CO')}/mes`
}

function buildPlans(
  base: number,
  basicCoverages: PlanCoverage[],
  recCoverages: PlanCoverage[],
  premCoverages: PlanCoverage[],
  reason: string,
  insurers: [string, string, string]
): Plan[] {
  const basicPrice = Math.round(base * 0.65 / 1000) * 1000
  const recPrice = Math.round(base / 1000) * 1000
  const premPrice = Math.round(base * 1.55 / 1000) * 1000

  return [
    {
      id: 'basic',
      name: 'Básico',
      price: basicPrice,
      priceLabel: formatPrice(basicPrice),
      coverages: basicCoverages,
      isRecommended: false,
      insurer: insurers[0],
    },
    {
      id: 'recommended',
      name: 'Recomendado',
      price: recPrice,
      priceLabel: formatPrice(recPrice),
      coverages: recCoverages,
      isRecommended: true,
      reasonRecommended: reason,
      insurer: insurers[1],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: premPrice,
      priceLabel: formatPrice(premPrice),
      coverages: premCoverages,
      isRecommended: false,
      insurer: insurers[2],
    },
  ]
}

function c(label: string, included: boolean): PlanCoverage {
  return { label, included }
}

function generateAutoQuote(answers: Record<string, string | string[]>): Plan[] {
  let base = 145000
  const value = String(answers.valor_vehiculo || '')
  if (value.includes('Menos')) base = 89000
  else if (value.includes('30M - 60M')) base = 130000
  else if (value.includes('60M - 100M')) base = 175000
  else if (value.includes('100M')) base = 250000

  const vehicleType = String(answers.tipo_vehiculo || '')
  if (vehicleType === 'Moto') base *= 0.7
  else if (vehicleType === 'Camioneta/SUV') base *= 1.1

  const year = parseInt(String(answers.anio_vehiculo || '2020'))
  if (year < 2015) base *= 1.15

  const uso = String(answers.uso_vehiculo || '')
  if (uso.includes('Transporte')) base *= 1.25
  else if (uso.includes('Trabajo')) base *= 1.1

  if (String(answers.siniestros || '').includes('2')) base *= 1.2
  else if (String(answers.siniestros || '').includes('1')) base *= 1.1
  if (String(answers.garaje || '') === 'No') base *= 1.05

  return buildPlans(
    base,
    [c('Responsabilidad civil', true), c('Pérdida total', true), c('Asistencia vial 24/7', true), c('Daños parciales', false), c('Vehículo de reemplazo', false), c('Fenómenos naturales', false)],
    [c('Responsabilidad civil', true), c('Pérdida total', true), c('Asistencia vial 24/7', true), c('Daños parciales', true), c('Vehículo de reemplazo', true), c('Fenómenos naturales', false)],
    [c('Responsabilidad civil', true), c('Pérdida total', true), c('Asistencia vial 24/7', true), c('Daños parciales', true), c('Vehículo de reemplazo', true), c('Fenómenos naturales', true)],
    'Mejor relación cobertura-precio para tu perfil.',
    ['Sura', 'Allianz', 'Zurich']
  )
}

function generateVidaQuote(answers: Record<string, string | string[]>): Plan[] {
  let base = 75000
  const age = parseInt(String(answers.edad || '35'))
  if (age < 30) base = 45000
  else if (age < 40) base = 70000
  else if (age < 50) base = 100000
  else base = 150000

  if (String(answers.fuma || '') === 'Sí') base *= 1.4
  if (String(answers.condicion_medica || '').includes('Sí')) base *= 1.3

  const monto = String(answers.monto_cobertura || '')
  if (monto.includes('300M - 500M')) base *= 1.3
  else if (monto.includes('Más')) base *= 1.6

  const dependientes = String(answers.dependientes || '')
  if (dependientes.includes('cónyuge e hijos')) base *= 1.15
  else if (dependientes.includes('Solo cónyuge') || dependientes.includes('Solo hijos')) base *= 1.05

  return buildPlans(
    base,
    [c('Fallecimiento cualquier causa', true), c('Muerte accidental (doble)', true), c('Gastos funerarios', true), c('Enfermedades graves', false), c('Incapacidad total', false), c('Anticipo enfermedad terminal', false)],
    [c('Fallecimiento cualquier causa', true), c('Muerte accidental (doble)', true), c('Gastos funerarios', true), c('Enfermedades graves', true), c('Incapacidad total', true), c('Anticipo enfermedad terminal', false)],
    [c('Fallecimiento cualquier causa', true), c('Muerte accidental (doble)', true), c('Gastos funerarios', true), c('Enfermedades graves', true), c('Incapacidad total', true), c('Anticipo enfermedad terminal', true)],
    'Protección completa para tu familia al mejor precio.',
    ['Bolívar', 'Sura', 'Mapfre']
  )
}

function generateSaludQuote(answers: Record<string, string | string[]>): Plan[] {
  let base = 180000
  const coverage = String(answers.cobertura_para || '')
  if (coverage.includes('pareja')) base = 300000
  else if (coverage.includes('Familia')) base = 420000

  const age = parseInt(String(answers.edad_mayor || '35'))
  if (age > 55) base *= 1.4
  else if (age > 45) base *= 1.2

  if (String(answers.preexistencias || '').includes('Sí')) base *= 1.15
  if (String(answers.medicamentos || '').includes('Sí')) base *= 1.1

  const prioridad = String(answers.prioridad || '')
  const reason = prioridad.includes('Prima baja')
    ? 'La opción más económica para tu perfil.'
    : prioridad.includes('amplia')
    ? 'Cobertura amplia con las mejores clínicas.'
    : 'Mejor equilibrio entre cobertura y precio.'

  return buildPlans(
    base,
    [c('Hospitalización y cirugía', true), c('Urgencias 24/7', true), c('Consultas especialistas', true), c('Telemedicina', true), c('Odontología', false), c('Maternidad', false), c('Medicamentos', false)],
    [c('Hospitalización y cirugía', true), c('Urgencias 24/7', true), c('Consultas especialistas', true), c('Telemedicina', true), c('Odontología', true), c('Maternidad', true), c('Medicamentos', false)],
    [c('Hospitalización y cirugía', true), c('Urgencias 24/7', true), c('Consultas especialistas', true), c('Telemedicina', true), c('Odontología', true), c('Maternidad', true), c('Medicamentos', true)],
    reason,
    ['Colsanitas', 'Sura', 'Allianz']
  )
}

function generateHogarQuote(answers: Record<string, string | string[]>): Plan[] {
  let base = 55000
  const value = String(answers.valor_inmueble || '')
  if (value.includes('Menos')) base = 35000
  else if (value.includes('150M - 300M')) base = 55000
  else if (value.includes('300M - 500M')) base = 80000
  else if (value.includes('Más')) base = 120000

  const contents = String(answers.valor_contenido || '')
  if (contents.includes('20M - 50M')) base += 15000
  else if (contents.includes('Más')) base += 30000

  const tipo = String(answers.tipo_inmueble || '')
  if (tipo === 'Casa') base *= 1.1
  else if (tipo === 'Local comercial') base *= 1.2

  if (String(answers.zona_riesgo || '') === 'Sí') base *= 1.15
  if (String(answers.propiedad || '') === 'Arrendatario') base *= 0.85

  return buildPlans(
    base,
    [c('Incendio y explosión', true), c('Terremoto', true), c('Robo', true), c('Daños por agua', false), c('Responsabilidad civil', false), c('Asistencias 24/7', false)],
    [c('Incendio y explosión', true), c('Terremoto', true), c('Robo', true), c('Daños por agua', true), c('Responsabilidad civil', true), c('Asistencias 24/7', false)],
    [c('Incendio y explosión', true), c('Terremoto', true), c('Robo', true), c('Daños por agua', true), c('Responsabilidad civil', true), c('Asistencias 24/7', true)],
    'Protección completa para tu hogar y contenidos.',
    ['Bolívar', 'Sura', 'Liberty']
  )
}

function generateAccidentesQuote(answers: Record<string, string | string[]>): Plan[] {
  let base = 35000
  const occupation = String(answers.ocupacion || '')
  if (occupation.includes('campo') || occupation.includes('Conductor')) base *= 1.4
  if (String(answers.deportes_riesgo || '').includes('Sí')) base *= 1.3

  const capital = String(answers.capital_asegurado || '')
  if (capital.includes('100M')) base *= 1.3
  else if (capital.includes('200M') && !capital.includes('Más')) base *= 1.6
  else if (capital.includes('Más')) base *= 2

  return buildPlans(
    base,
    [c('Muerte accidental', true), c('Invalidez total', true), c('Gastos médicos', true), c('Invalidez parcial', false), c('Incapacidad temporal', false), c('Gastos de traslado', false)],
    [c('Muerte accidental', true), c('Invalidez total', true), c('Gastos médicos', true), c('Invalidez parcial', true), c('Incapacidad temporal', true), c('Gastos de traslado', false)],
    [c('Muerte accidental', true), c('Invalidez total', true), c('Gastos médicos', true), c('Invalidez parcial', true), c('Incapacidad temporal', true), c('Gastos de traslado', true)],
    'Mejor cobertura para tu perfil de actividad.',
    ['Positiva', 'Sura', 'Mapfre']
  )
}

function generateEmpresarialQuote(answers: Record<string, string | string[]>): Plan[] {
  let base = 450000
  const employees = String(answers.num_empleados || '')
  if (employees.includes('1-5')) base = 250000
  else if (employees.includes('6-20')) base = 450000
  else if (employees.includes('21-50')) base = 800000
  else if (employees.includes('Más')) base = 1500000

  const needs = Array.isArray(answers.necesidades) ? answers.necesidades : []
  base += needs.length * 80000

  const tipoEmpresa = String(answers.tipo_empresa || '')
  if (tipoEmpresa === 'Construcción') base *= 1.3
  else if (tipoEmpresa === 'Manufactura') base *= 1.2

  return buildPlans(
    base,
    [c('Responsabilidad civil general', true), c('Todo riesgo instalaciones', true), c('Vida colectiva empleados', false), c('Salud colectiva', false), c('Flota vehicular', false), c('Transporte mercancías', false)],
    [c('Responsabilidad civil general', true), c('Todo riesgo instalaciones', true), c('Vida colectiva empleados', true), c('Salud colectiva', true), c('Flota vehicular', false), c('Transporte mercancías', false)],
    [c('Responsabilidad civil general', true), c('Todo riesgo instalaciones', true), c('Vida colectiva empleados', true), c('Salud colectiva', true), c('Flota vehicular', true), c('Transporte mercancías', true)],
    'Solución integral para proteger tu empresa.',
    ['Sura', 'Allianz', 'AXA Colpatria']
  )
}

export function generateQuote(input: QuoteInput): Plan[] {
  switch (input.insuranceType) {
    case 'auto': return generateAutoQuote(input.answers)
    case 'vida': return generateVidaQuote(input.answers)
    case 'salud': return generateSaludQuote(input.answers)
    case 'hogar': return generateHogarQuote(input.answers)
    case 'accidentes': return generateAccidentesQuote(input.answers)
    case 'empresarial': return generateEmpresarialQuote(input.answers)
    default: return []
  }
}
