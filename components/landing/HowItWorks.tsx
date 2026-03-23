'use client'

import { useInView } from '@/hooks/useInView'

const STEPS = [
  {
    number: 1,
    title: 'Cuentanos',
    description: 'Tu perfil y necesidades',
  },
  {
    number: 2,
    title: 'Comparamos',
    description: 'Las mejores opciones del mercado',
  },
  {
    number: 3,
    title: 'Te protegemos',
    description: 'Gestionamos tu poliza y te acompanamos',
  },
]

export default function HowItWorks() {
  const { ref, inView } = useInView()

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-title text-3xl md:text-4xl font-bold text-text mb-3">
            ¿Como funciona?
          </h2>
          <p className="text-text-mid max-w-lg mx-auto">
            Obtener la mejor proteccion es mas facil de lo que crees.
          </p>
        </div>

        <div ref={ref} className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 max-w-4xl mx-auto">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex items-center">
              {/* Step */}
              <div
                className={`flex flex-col items-center text-center w-48 transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: inView ? `${i * 200}ms` : '0ms' }}
              >
                <div className="w-16 h-16 bg-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-blue/20">
                  {step.number}
                </div>
                <h3 className="font-semibold text-text text-lg mb-1">{step.title}</h3>
                <p className="text-text-mid text-sm">{step.description}</p>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block w-20 lg:w-32 border-t-2 border-dashed border-border mx-4 mt-[-40px]" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/cotizar"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue text-white rounded-xl font-semibold hover:bg-blue-mid transition shadow-lg shadow-blue/20"
          >
            Empieza ahora — es gratis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12H19M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
