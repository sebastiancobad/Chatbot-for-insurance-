import type { QuoteStep, InsuranceType } from './types'

export const QUOTE_FLOWS: Record<string, QuoteStep[]> = {
  auto: [
    { id: 'auto_1', question: '¿Cuál es el año y modelo de tu vehículo?', key: 'vehiculo', type: 'text' },
    { id: 'auto_2', question: '¿Cuántos kilómetros aproximados tiene?', key: 'kilometraje', type: 'text' },
    { id: 'auto_3', question: '¿Lo usas para trabajo o uso personal?', key: 'uso', type: 'select', options: ['Uso personal', 'Trabajo', 'Ambos'] },
    { id: 'auto_4', question: '¿Tienes garaje en casa?', key: 'garaje', type: 'select', options: ['Sí', 'No'] },
    { id: 'auto_5', question: '¿Has tenido siniestros en los últimos 2 años?', key: 'siniestros', type: 'select', options: ['No, ninguno', 'Sí, uno', 'Sí, más de uno'] },
  ],
  vida: [
    { id: 'vida_1', question: '¿Cuántos años tienes?', key: 'edad', type: 'text' },
    { id: 'vida_2', question: '¿Fumas actualmente?', key: 'fuma', type: 'select', options: ['No', 'Sí', 'Dejé de fumar'] },
    { id: 'vida_3', question: '¿Tienes alguna condición médica preexistente importante?', key: 'condiciones', type: 'text' },
    { id: 'vida_4', question: '¿Qué monto de cobertura buscas? (orientativo)', key: 'cobertura', type: 'select', options: ['Menos de $50M', '$50M - $100M', '$100M - $200M', 'Más de $200M'] },
    { id: 'vida_5', question: '¿Tienes beneficiarios específicos en mente?', key: 'beneficiarios', type: 'text' },
  ],
  salud: [
    { id: 'salud_1', question: '¿Cuántos años tienes?', key: 'edad', type: 'text' },
    { id: 'salud_2', question: '¿Es solo para ti o para toda la familia?', key: 'cobertura_para', type: 'select', options: ['Solo para mí', 'Para mi familia'] },
    { id: 'salud_3', question: '¿Tienes condiciones preexistentes?', key: 'condiciones', type: 'text' },
    { id: 'salud_4', question: '¿Qué es más importante para ti?', key: 'prioridad', type: 'select', options: ['Cobertura amplia', 'Prima baja', 'Equilibrio entre ambas'] },
    { id: 'salud_5', question: '¿Usas medicamentos crónicos?', key: 'medicamentos', type: 'select', options: ['No', 'Sí'] },
  ],
  hogar: [
    { id: 'hogar_1', question: '¿Qué tipo de inmueble es?', key: 'tipo_inmueble', type: 'select', options: ['Casa', 'Apartamento', 'Otro'] },
    { id: 'hogar_2', question: '¿Cuál es el área aproximada en metros cuadrados?', key: 'area', type: 'text' },
    { id: 'hogar_3', question: '¿En qué zona/ciudad está ubicado?', key: 'ubicacion', type: 'text' },
    { id: 'hogar_4', question: '¿Tienes sistema de seguridad?', key: 'seguridad', type: 'select', options: ['Sí', 'No'] },
    { id: 'hogar_5', question: '¿Qué quieres proteger principalmente?', key: 'proteccion', type: 'select', options: ['Estructura', 'Contenidos', 'Ambos'] },
  ],
}

export function getQuoteSteps(type: InsuranceType): QuoteStep[] {
  return QUOTE_FLOWS[type] || []
}

export function formatQuoteSummary(type: InsuranceType, answers: Record<string, string>): string {
  const labels: Record<string, string> = {
    vehiculo: 'Vehículo', kilometraje: 'Kilometraje', uso: 'Uso', garaje: 'Garaje',
    siniestros: 'Siniestros previos', edad: 'Edad', fuma: 'Fumador',
    condiciones: 'Condiciones preexistentes', cobertura: 'Cobertura deseada',
    beneficiarios: 'Beneficiarios', cobertura_para: 'Cobertura para',
    prioridad: 'Prioridad', medicamentos: 'Medicamentos crónicos',
    tipo_inmueble: 'Tipo inmueble', area: 'Área', ubicacion: 'Ubicación',
    seguridad: 'Seguridad', proteccion: 'Protección'
  }
  return Object.entries(answers)
    .map(([key, val]) => `${labels[key] || key}: ${val}`)
    .join(' | ')
}
