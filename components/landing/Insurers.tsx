const INSURERS = [
  'Sura', 'Bolivar', 'Mapfre', 'Allianz', 'AXA',
  'Liberty', 'Seguros del Estado', 'HDI', 'Mundial', 'Equidad',
]

export default function Insurers() {
  return (
    <section className="py-16 md:py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-title text-3xl md:text-4xl font-bold text-text mb-3">
            Trabajamos con las mejores aseguradoras
          </h2>
          <p className="text-text-mid max-w-2xl mx-auto">
            Accede a los mejores productos del mercado en un solo lugar
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {INSURERS.map(name => (
            <div
              key={name}
              className="bg-white border border-border rounded-xl p-5 flex items-center justify-center h-20 hover:shadow-md hover:border-blue/30 transition"
            >
              <span className="text-text-mid font-semibold text-sm text-center">{name}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-text-soft text-xs mt-6">
          Y muchas mas. Consulta por la aseguradora de tu preferencia.
        </p>
      </div>
    </section>
  )
}
