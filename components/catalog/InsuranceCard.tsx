import type { InsuranceRamo } from '@/lib/insurance-content'

export default function InsuranceCard({ ramo }: { ramo: InsuranceRamo }) {
  return (
    <a
      href={`/seguros/${ramo.slug}`}
      className="group bg-white border border-border rounded-2xl p-6 hover:shadow-lg hover:border-blue/30 transition-all block"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
        style={{ backgroundColor: `${ramo.color}15`, color: ramo.color }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L3 7V12C3 17.5 7.4 22.3 12 23C16.6 22.3 21 17.5 21 12V7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 12L11 14L15 10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="font-semibold text-text text-lg mb-1">{ramo.name}</h3>
      <p className="text-text-mid text-sm mb-3 line-clamp-2">{ramo.tagline}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: ramo.color }}>{ramo.priceFrom}</span>
        <span className="inline-flex items-center gap-1 text-blue text-sm font-medium opacity-0 group-hover:opacity-100 transition">
          Ver más
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12H19M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </a>
  )
}
