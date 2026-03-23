import type { InsuranceRamo } from '@/lib/insurance-content'

export default function CoverageList({ ramo }: { ramo: InsuranceRamo }) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-title text-3xl font-bold text-text mb-8 text-center">
          ¿Qué cubre este seguro?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Included */}
          <div className="bg-teal-light/50 rounded-2xl p-6 border border-teal/10">
            <h3 className="font-semibold text-teal text-lg mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-teal">
                <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Qué incluye
            </h3>
            <ul className="space-y-3">
              {ramo.coverages.included.map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-text">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00936C" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Excluded */}
          <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
            <h3 className="font-semibold text-red-500 text-lg mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-500">
                <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              </svg>
              Qué no incluye
            </h3>
            <ul className="space-y-3">
              {ramo.coverages.excluded.map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-text-mid">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" className="mt-0.5 flex-shrink-0">
                    <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                    <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
