const FOOTER_LINKS = {
  Seguros: [
    { label: 'Auto', href: '/seguros/auto' },
    { label: 'Vida', href: '/seguros/vida' },
    { label: 'Salud', href: '/seguros/salud' },
    { label: 'Hogar', href: '/seguros/hogar' },
    { label: 'Empresarial', href: '/seguros/empresarial' },
  ],
  Empresa: [
    { label: 'Quienes somos', href: '/nosotros' },
    { label: 'Como trabajamos', href: '/nosotros#como' },
    { label: 'Blog', href: '/blog' },
    { label: 'Trabaja con nosotros', href: '/empleo' },
  ],
  Contacto: [
    { label: 'WhatsApp', href: '#' },
    { label: 'Email', href: 'mailto:info@miseguros.com' },
    { label: 'Bogota, Colombia', href: '#' },
  ],
}

export default function PublicFooter() {
  return (
    <footer className="bg-text pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-blue rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M12 8V16M8 10V14M16 10V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-title text-lg font-bold text-white">Mi Agencia de Seguros</span>
            </div>
            <p className="text-text-soft text-sm">&ldquo;Protegemos lo que mas importa&rdquo;</p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.label}>
                    <a href={link.href} className="text-text-soft text-sm hover:text-white transition">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-text-soft text-xs">
            &copy; {new Date().getFullYear()} Mi Agencia de Seguros. Todos los derechos reservados.
          </p>
          <a href="/privacidad" className="text-text-soft text-xs hover:text-white transition">
            Politica de privacidad
          </a>
        </div>
      </div>
    </footer>
  )
}
