import type { InsuranceRamo } from '@/lib/insurance-content'

export default function InsuranceProcess({ ramo }: { ramo: InsuranceRamo }) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-title text-3xl font-bold text-text mb-3 text-center">
          ¿Cómo contratar?
        </h2>
        <p className="text-text-mid text-center mb-12 max-w-lg mx-auto">
          Obtener tu {ramo.name.toLowerCase()} es más fácil de lo que crees.
        </p>

        <div className="flex flex-col md:flex-row items-start justify-center gap-6 md:gap-0 max-w-4xl mx-auto">
          {ramo.process.map((step, i) => (
            <div key={step.step} className="flex items-center">
              <div className="flex flex-col items-center text-center w-44 md:w-48">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3 shadow-md"
                  style={{ backgroundColor: ramo.color }}
                >
                  {step.step}
                </div>
                <h3 className="font-semibold text-text mb-1">{step.title}</h3>
                <p className="text-text-mid text-sm">{step.description}</p>
              </div>
              {i < ramo.process.length - 1 && (
                <div className="hidden md:block w-16 lg:w-24 border-t-2 border-dashed border-border mx-2 mt-[-40px]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
