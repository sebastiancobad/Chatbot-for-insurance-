const TESTIMONIALS = [
  {
    name: 'Maria Gonzalez',
    city: 'Bogota',
    type: 'Seguro de Auto',
    text: 'Excelente servicio. Me ayudaron a encontrar el mejor seguro para mi carro y cuando tuve un accidente me acompanaron en todo el proceso.',
    rating: 5,
    color: 'bg-blue',
  },
  {
    name: 'Carlos Rodriguez',
    city: 'Medellin',
    type: 'Seguro de Vida',
    text: 'Lo que mas valoro es que me explicaron todas las opciones con claridad. Sin presion y con total honestidad sobre que me convenia.',
    rating: 5,
    color: 'bg-teal',
  },
  {
    name: 'Ana Martinez',
    city: 'Cali',
    type: 'Seguro de Salud',
    text: 'Llevaba anos con el mismo seguro sin saber si era el mejor. Me ahorraron casi 200 mil pesos al mes con mejor cobertura.',
    rating: 5,
    color: 'bg-blue-mid',
  },
]

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase()
}

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-title text-3xl md:text-4xl font-bold text-text mb-3">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-text-mid">Mas de 500 familias ya confian en nosotros</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="bg-bg rounded-2xl p-6 border border-border">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B" stroke="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-text text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">{t.name}</p>
                  <p className="text-xs text-text-soft">{t.city} · {t.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
