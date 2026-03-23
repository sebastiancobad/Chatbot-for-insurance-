import type { Metadata } from 'next'
import { insuranceContent } from '@/lib/insurance-content'
import InsuranceCard from '@/components/catalog/InsuranceCard'

export const metadata: Metadata = {
  title: 'Nuestros Seguros | Mi Agencia de Seguros',
  description: 'Seguros de auto, vida, salud, hogar, accidentes personales y empresariales. Comparamos entre las mejores aseguradoras para encontrar tu póliza ideal.',
  keywords: 'seguros, seguro de auto, seguro de vida, seguro de salud, seguro de hogar, seguros empresariales, cotizar seguros',
  openGraph: {
    title: 'Nuestros Seguros — Mi Agencia de Seguros',
    description: 'Encuentra la protección ideal para cada etapa de tu vida. Cotiza gratis.',
    type: 'website',
  },
}

export default function SegurosIndexPage() {
  const ramos = Object.values(insuranceContent)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-white to-blue-light py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-title text-4xl md:text-5xl font-bold text-text mb-4">
            Nuestros Seguros
          </h1>
          <p className="text-text-mid text-lg max-w-2xl mx-auto">
            Encuentra la protección ideal para cada etapa de tu vida. Comparamos entre las mejores aseguradoras para darte la mejor opción.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ramos.map(ramo => (
              <InsuranceCard key={ramo.slug} ramo={ramo} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-bg">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-title text-2xl font-bold text-text mb-3">
            ¿No sabes cuál necesitas?
          </h2>
          <p className="text-text-mid mb-6">
            Habla con uno de nuestros asesores y te ayudamos a encontrar el seguro perfecto para ti.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/cotizar"
              className="px-8 py-3.5 bg-blue text-white rounded-xl font-semibold hover:bg-blue-mid transition shadow-lg text-center"
            >
              Cotizar gratis
            </a>
            <a
              href={`https://wa.me/573000000000?text=${encodeURIComponent('Hola, necesito ayuda para elegir un seguro.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3.5 border-2 border-blue text-blue rounded-xl font-semibold hover:bg-blue-light transition text-center"
            >
              Hablar con un asesor
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
