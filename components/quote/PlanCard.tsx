import type { Plan } from '@/lib/quote-engine'

interface Props {
  plan: Plan
  onSelect: (plan: Plan) => void
}

export default function PlanCard({ plan, onSelect }: Props) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 p-5 transition-all ${
        plan.isRecommended
          ? 'border-blue bg-blue-light/50 shadow-lg scale-[1.02]'
          : 'border-border bg-white hover:border-blue/40'
      }`}
    >
      {plan.isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue text-white text-xs font-bold rounded-full whitespace-nowrap">
          Recomendado
        </div>
      )}

      <div className="text-center mb-4 pt-1">
        <h3 className="font-semibold text-text text-lg">{plan.name}</h3>
        <p className="text-xs text-text-soft">{plan.insurer}</p>
        <p className="text-2xl font-bold text-blue mt-2">{plan.priceLabel}</p>
      </div>

      {plan.reasonRecommended && (
        <p className="text-xs text-blue bg-blue-light px-3 py-1.5 rounded-lg mb-3 text-center">
          {plan.reasonRecommended}
        </p>
      )}

      <ul className="space-y-2.5 flex-1 mb-5">
        {plan.coverages.map(cov => (
          <li key={cov.label} className="flex items-center gap-2 text-sm">
            {cov.included ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00936C" strokeWidth="2.5" className="flex-shrink-0">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2.5" className="flex-shrink-0">
                <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
              </svg>
            )}
            <span className={cov.included ? 'text-text' : 'text-text-soft line-through'}>{cov.label}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan)}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition ${
          plan.isRecommended
            ? 'bg-blue text-white hover:bg-blue-mid'
            : 'border-2 border-blue text-blue hover:bg-blue-light'
        }`}
      >
        Quiero este plan
      </button>
    </div>
  )
}
