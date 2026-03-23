export default function FinalCTA() {
  return (
    <section className="py-16 md:py-20 bg-blue">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-title text-3xl md:text-4xl font-bold text-white mb-4">
          ¿Listo para estar protegido?
        </h2>
        <p className="text-blue-light text-lg mb-8">
          Cotiza gratis en menos de 5 minutos.<br />
          No necesitas tarjeta de credito ni compromiso.
        </p>

        <a
          href="/cotizar"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue rounded-xl font-bold text-lg hover:bg-blue-light transition shadow-lg"
        >
          Cotizar mi seguro ahora
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12H19M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          <span className="flex items-center gap-1.5 text-blue-light text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Respuesta en 24h
          </span>
          <span className="flex items-center gap-1.5 text-blue-light text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Asesoria gratuita
          </span>
          <span className="flex items-center gap-1.5 text-blue-light text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Sin compromiso
          </span>
        </div>
      </div>
    </section>
  )
}
