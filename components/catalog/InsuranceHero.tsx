import type { InsuranceRamo } from '@/lib/insurance-content'

export default function InsuranceHero({ ramo }: { ramo: InsuranceRamo }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${ramo.color}08 0%, ${ramo.color}15 100%)` }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-text-soft">
            <li><a href="/inicio" className="hover:text-blue transition">Inicio</a></li>
            <li><span className="mx-1">&gt;</span></li>
            <li><a href="/seguros" className="hover:text-blue transition">Seguros</a></li>
            <li><span className="mx-1">&gt;</span></li>
            <li className="text-text font-medium">{ramo.name}</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <h1 className="font-title text-4xl md:text-5xl font-bold text-text mb-4">
            {ramo.name}
          </h1>
          <p className="text-xl text-text-mid mb-2 font-medium">{ramo.tagline}</p>
          <p className="text-text-mid mb-8 leading-relaxed">{ramo.description}</p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href={`/cotizar?tipo=${ramo.slug}`}
              className="px-8 py-3.5 text-white rounded-xl font-semibold hover:opacity-90 transition shadow-lg text-center"
              style={{ backgroundColor: ramo.color }}
            >
              Cotizar este seguro
            </a>
            <span className="px-5 py-3.5 bg-white border border-border rounded-xl text-text font-semibold text-sm">
              {ramo.priceFrom}
            </span>
          </div>

          {/* Target audience */}
          <div className="mt-8 flex flex-wrap gap-2">
            {ramo.targetAudience.map(audience => (
              <span key={audience} className="px-3 py-1 bg-white/80 border border-border rounded-full text-xs text-text-mid">
                {audience}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
