'use client'

import { useInView } from '@/hooks/useInView'

const FEATURES = [
  {
    title: 'Multimarca',
    description: 'Comparamos entre 10+ aseguradoras para darte la mejor opcion.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 002 2h2a2 2 0 002-2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Sin costos extra',
    description: 'Nuestra asesoria es gratuita, ganamos comision de las aseguradoras.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6V18M9 9.5C9 8.12 10.34 7 12 7s3 1.12 3 2.5S13.66 12 12 12s-3 1.12-3 2.5S10.34 17 12 17" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Acompanamiento',
    description: 'Te guiamos en el proceso de siniestros de principio a fin.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Rapidez',
    description: 'Cotizacion en menos de 24 horas.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6V12L16 14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function WhyUs() {
  const { ref, inView } = useInView()

  return (
    <section className="py-16 md:py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="inline-block px-3 py-1 bg-blue-light text-blue text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
              Agencia independiente
            </span>
            <h2 className="font-title text-3xl md:text-4xl font-bold text-text mb-4">
              Trabajamos para ti, no para las aseguradoras
            </h2>
            <p className="text-text-mid mb-6 leading-relaxed">
              A diferencia de las aseguradoras que solo ofrecen sus propios productos, como agencia independiente tenemos acceso a todas las opciones del mercado. Nuestro unico compromiso es encontrar la mejor relacion calidad-precio para ti.
            </p>
            <a href="/nosotros" className="inline-flex items-center gap-2 text-blue font-semibold hover:text-blue-mid transition">
              Conoce como trabajamos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12H19M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* Right: Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.title}
                className={`bg-white rounded-2xl border border-border p-5 transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: inView ? `${200 + i * 100}ms` : '0ms' }}
              >
                <div className="w-11 h-11 bg-blue-light rounded-xl flex items-center justify-center text-blue mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-text mb-1">{feat.title}</h3>
                <p className="text-text-mid text-sm">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
