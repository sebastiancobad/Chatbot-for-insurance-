import type { Metadata } from 'next'
import { Suspense } from 'react'
import QuoteWizard from '@/components/quote/QuoteWizard'

export const metadata: Metadata = {
  title: 'Cotizar Seguro Gratis | Mi Agencia de Seguros',
  description: 'Cotiza tu seguro de auto, vida, salud, hogar, accidentes o empresarial en menos de 5 minutos. Comparamos entre las mejores aseguradoras de Colombia.',
  keywords: 'cotizar seguro, cotización seguro, seguro barato, comparar seguros, cotizar gratis',
  openGraph: {
    title: 'Cotiza tu Seguro Gratis — Mi Agencia de Seguros',
    description: 'Compara planes de múltiples aseguradoras en menos de 5 minutos. Sin compromiso.',
    type: 'website',
  },
}

export default function CotizarPage() {
  return (
    <section className="py-10 md:py-16 bg-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="text-center py-16">
            <div className="w-8 h-8 border-3 border-blue border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-text-soft text-sm mt-3">Cargando cotizador...</p>
          </div>
        }>
          <QuoteWizard />
        </Suspense>
      </div>
    </section>
  )
}
