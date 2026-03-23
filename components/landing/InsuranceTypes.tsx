'use client'

import { useInView } from '@/hooks/useInView'

const INSURANCE_TYPES = [
  {
    slug: 'auto',
    title: 'Auto',
    description: 'Protege tu vehiculo ante cualquier imprevisto',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 17H3V14L5 6H19L21 14V17H19M5 17L5.5 19H7.5L8 17M5 17H8M19 17L18.5 19H16.5L16 17M19 17H16M8 17H16" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7.5" cy="14" r="1" fill="currentColor" />
        <circle cx="16.5" cy="14" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    slug: 'vida',
    title: 'Vida',
    description: 'Asegura el futuro de tu familia',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'salud',
    title: 'Salud',
    description: 'Atencion medica cuando mas lo necesitas',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12H18L15 21L9 3L6 12H2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'hogar',
    title: 'Hogar',
    description: 'Cobertura completa para tu vivienda',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'accidentes',
    title: 'Accidentes',
    description: 'Proteccion ante imprevistos personales',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    slug: 'empresarial',
    title: 'Empresarial',
    description: 'Soluciones para tu negocio',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 12V12.01" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function InsuranceTypes() {
  const { ref, inView } = useInView()

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-title text-3xl md:text-4xl font-bold text-text mb-3">
            ¿Que seguros manejamos?
          </h2>
          <p className="text-text-mid max-w-2xl mx-auto">
            Tenemos la solucion ideal para cada necesidad. Comparamos entre las mejores aseguradoras para encontrar tu poliza perfecta.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INSURANCE_TYPES.map((type, i) => (
            <a
              key={type.slug}
              href={`/seguros/${type.slug}`}
              className={`group p-6 bg-white border border-border rounded-2xl hover:shadow-lg hover:border-blue transition-all duration-300 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: inView ? `${i * 80}ms` : '0ms' }}
            >
              <div className="w-14 h-14 bg-blue-light rounded-xl flex items-center justify-center text-blue mb-4 group-hover:bg-blue group-hover:text-white transition-colors">
                {type.icon}
              </div>
              <h3 className="font-semibold text-text text-lg mb-1">Seguro de {type.title}</h3>
              <p className="text-text-mid text-sm">{type.description}</p>
              <span className="inline-flex items-center gap-1 text-blue text-sm font-medium mt-3 opacity-0 group-hover:opacity-100 transition">
                Ver mas
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12H19M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
