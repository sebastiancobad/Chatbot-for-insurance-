'use client'

import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Inicio', href: '/inicio' },
  { label: 'Seguros', href: '#seguros' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Contacto', href: '#contacto' },
]

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/inicio" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M12 8V16M8 10V14M16 10V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-title text-lg font-bold text-text">Mi Agencia de Seguros</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} className="text-sm text-text-mid hover:text-blue transition font-medium">
              {link.label}
            </a>
          ))}
          <a
            href="/cotizar"
            className="px-5 py-2 bg-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-mid transition"
          >
            Cotizar gratis
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-text-mid"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
              <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
              <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 pb-4 space-y-2">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="block py-2 text-text-mid hover:text-blue transition font-medium"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/cotizar"
            className="block text-center py-2.5 bg-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-mid transition"
          >
            Cotizar gratis
          </a>
        </div>
      )}
    </header>
  )
}
