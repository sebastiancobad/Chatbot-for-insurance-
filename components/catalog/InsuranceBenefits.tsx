import type { InsuranceRamo } from '@/lib/insurance-content'

const BENEFIT_ICONS = [
  <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6V12L16 14" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L3 7V12C3 17.5 7.4 22.3 12 23C16.6 22.3 21 17.5 21 12V7L12 2Z" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 12L11 14L15 10" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6V18M9 9.5C9 8.12 10.34 7 12 7s3 1.12 3 2.5S13.66 12 12 12s-3 1.12-3 2.5S10.34 17 12 17" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/></svg>,
]

export default function InsuranceBenefits({ ramo }: { ramo: InsuranceRamo }) {
  return (
    <section className="py-16 md:py-20 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-title text-3xl font-bold text-text mb-3 text-center">
          ¿Por qué contratarlo con nosotros?
        </h2>
        <p className="text-text-mid text-center mb-10 max-w-2xl mx-auto">
          Como agencia independiente, nuestro compromiso es encontrar la mejor opción para ti.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ramo.benefits.map((benefit, i) => (
            <div key={benefit.title} className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${ramo.color}15`, color: ramo.color }}
              >
                {BENEFIT_ICONS[i % BENEFIT_ICONS.length]}
              </div>
              <h3 className="font-semibold text-text mb-1">{benefit.title}</h3>
              <p className="text-text-mid text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
