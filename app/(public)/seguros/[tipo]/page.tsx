import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { insuranceContent, getRamo, getRelatedRamos, RAMO_SLUGS } from '@/lib/insurance-content'
import InsuranceHero from '@/components/catalog/InsuranceHero'
import CoverageList from '@/components/catalog/CoverageList'
import InsuranceBenefits from '@/components/catalog/InsuranceBenefits'
import InsuranceProcess from '@/components/catalog/InsuranceProcess'
import InsuranceFAQ from '@/components/catalog/InsuranceFAQ'
import RamoCTA from '@/components/catalog/RamoCTA'
import RelatedInsurances from '@/components/catalog/RelatedInsurances'

interface PageProps {
  params: { tipo: string }
}

export async function generateStaticParams() {
  return RAMO_SLUGS.map(tipo => ({ tipo }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ramo = getRamo(params.tipo)
  if (!ramo) return { title: 'Seguro no encontrado' }

  return {
    title: `${ramo.name} | Mi Agencia de Seguros`,
    description: ramo.description,
    keywords: ramo.seoKeywords.join(', '),
    openGraph: {
      title: `${ramo.name} — ${ramo.tagline}`,
      description: ramo.description,
      type: 'website',
    },
  }
}

export default function RamoPage({ params }: PageProps) {
  const ramo = getRamo(params.tipo)
  if (!ramo) notFound()

  const related = getRelatedRamos(params.tipo, 3)

  // JSON-LD breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: '/inicio' },
      { '@type': 'ListItem', position: 2, name: 'Seguros', item: '/seguros' },
      { '@type': 'ListItem', position: 3, name: ramo.name, item: `/seguros/${ramo.slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <InsuranceHero ramo={ramo} />
      <CoverageList ramo={ramo} />
      <InsuranceBenefits ramo={ramo} />
      <InsuranceProcess ramo={ramo} />
      <InsuranceFAQ ramo={ramo} />
      <RamoCTA ramo={ramo} />
      <RelatedInsurances ramos={related} />
    </>
  )
}
