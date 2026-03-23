import type { Metadata } from 'next'
import Hero from '@/components/landing/Hero'
import InsuranceTypes from '@/components/landing/InsuranceTypes'
import WhyUs from '@/components/landing/WhyUs'
import HowItWorks from '@/components/landing/HowItWorks'
import Insurers from '@/components/landing/Insurers'
import Testimonials from '@/components/landing/Testimonials'
import FinalCTA from '@/components/landing/FinalCTA'

export const metadata: Metadata = {
  title: 'Mi Agencia de Seguros — Seguros de Auto, Vida, Salud y Hogar',
  description:
    'Agencia de seguros independiente. Comparamos entre las mejores aseguradoras para encontrar la poliza ideal para ti. Cotiza gratis.',
  keywords: 'seguros, agencia de seguros, seguro de auto, seguro de vida, seguro de salud, seguro de hogar, cotizar seguros',
  openGraph: {
    title: 'Mi Agencia de Seguros — Tu Agencia de Seguros de Confianza',
    description: 'Cotiza tu seguro gratis. Trabajamos con +10 aseguradoras para encontrar la mejor opcion.',
    type: 'website',
  },
}

export default function InicioPage() {
  return (
    <>
      <Hero />
      <div id="seguros">
        <InsuranceTypes />
      </div>
      <div id="nosotros">
        <WhyUs />
      </div>
      <HowItWorks />
      <Insurers />
      <Testimonials />
      <div id="contacto">
        <FinalCTA />
      </div>
    </>
  )
}
