import type { InsuranceRamo } from '@/lib/insurance-content'
import InsuranceCard from './InsuranceCard'

export default function RelatedInsurances({ ramos }: { ramos: InsuranceRamo[] }) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-title text-2xl font-bold text-text mb-8 text-center">
          También te puede interesar
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {ramos.map(ramo => (
            <InsuranceCard key={ramo.slug} ramo={ramo} />
          ))}
        </div>
      </div>
    </section>
  )
}
