import type { InsuranceRamo } from '@/lib/insurance-content'

export default function RamoCTA({ ramo }: { ramo: InsuranceRamo }) {
  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: ramo.color }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-title text-3xl md:text-4xl font-bold text-white mb-4">
          ¿Listo para cotizar tu {ramo.name.toLowerCase()}?
        </h2>
        <p className="text-white/80 mb-8">
          Cotiza gratis en menos de 5 minutos. Sin compromiso.
        </p>
        <a
          href={`/cotizar?tipo=${ramo.slug}`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white rounded-xl font-bold text-lg hover:bg-gray-50 transition shadow-lg"
          style={{ color: ramo.color }}
        >
          Cotizar ahora
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12H19M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  )
}
