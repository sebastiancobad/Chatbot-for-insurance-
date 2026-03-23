'use client'

import { useState, useRef, useEffect } from 'react'

const SEGUROS_LINKS = [
  { label: 'Ver todos los seguros', href: '/seguros', highlight: true },
  { label: 'Auto', href: '/seguros/auto' },
  { label: 'Vida', href: '/seguros/vida' },
  { label: 'Salud', href: '/seguros/salud' },
  { label: 'Hogar', href: '/seguros/hogar' },
  { label: 'Accidentes', href: '/seguros/accidentes' },
  { label: 'Empresarial', href: '/seguros/empresarial' },
]

const SEGUROS_ICONS: Record<string, JSX.Element> = {
  Auto: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 17H3V14L5 6H19L21 14V17H19M5 17L5.5 19H7.5L8 17M5 17H8M19 17L18.5 19H16.5L16 17M19 17H16M8 17H16" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7.5" cy="14" r="1" fill="currentColor"/><circle cx="16.5" cy="14" r="1" fill="currentColor"/></svg>,
  Vida: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Salud: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12H18L15 21L9 3L6 12H2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Hogar: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12L12 3L21 12M5 10V20C5 20.55 5.45 21 6 21H9V15H15V21H18C18.55 21 19 20.55 19 20V10" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Accidentes: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Empresarial: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
}

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [segurosOpen, setSegurosOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSegurosOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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
          <a href="/inicio" className="text-sm text-text-mid hover:text-blue transition font-medium">
            Inicio
          </a>

          {/* Seguros dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setSegurosOpen(!segurosOpen)}
              className="text-sm text-text-mid hover:text-blue transition font-medium flex items-center gap-1"
            >
              Seguros
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className={`transition-transform ${segurosOpen ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {segurosOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-xl border border-border shadow-lg py-2 z-50">
                {SEGUROS_LINKS.map((link, i) => (
                  <div key={link.href}>
                    {i === 1 && <div className="border-t border-border my-1.5" />}
                    <a
                      href={link.href}
                      onClick={() => setSegurosOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-blue-light transition ${
                        link.highlight ? 'text-blue font-semibold' : 'text-text-mid hover:text-blue'
                      }`}
                    >
                      {!link.highlight && SEGUROS_ICONS[link.label] && (
                        <span className="text-text-soft">{SEGUROS_ICONS[link.label]}</span>
                      )}
                      {link.label}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <a href="/inicio#nosotros" className="text-sm text-text-mid hover:text-blue transition font-medium">
            Nosotros
          </a>
          <a href="/inicio#contacto" className="text-sm text-text-mid hover:text-blue transition font-medium">
            Contacto
          </a>
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
        <div className="md:hidden bg-white border-t border-border px-4 pb-4 space-y-1">
          <a href="/inicio" className="block py-2 text-text-mid hover:text-blue transition font-medium" onClick={() => setMenuOpen(false)}>
            Inicio
          </a>
          {/* Mobile seguros submenu */}
          <div className="py-1">
            <p className="text-xs text-text-soft font-semibold uppercase tracking-wide mb-1 px-1">Seguros</p>
            {SEGUROS_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 py-1.5 pl-3 text-sm hover:text-blue transition ${
                  link.highlight ? 'text-blue font-semibold' : 'text-text-mid'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {!link.highlight && SEGUROS_ICONS[link.label] && (
                  <span className="text-text-soft">{SEGUROS_ICONS[link.label]}</span>
                )}
                {link.label}
              </a>
            ))}
          </div>
          <a href="/inicio#nosotros" className="block py-2 text-text-mid hover:text-blue transition font-medium" onClick={() => setMenuOpen(false)}>
            Nosotros
          </a>
          <a href="/inicio#contacto" className="block py-2 text-text-mid hover:text-blue transition font-medium" onClick={() => setMenuOpen(false)}>
            Contacto
          </a>
          <a
            href="/cotizar"
            className="block text-center py-2.5 bg-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-mid transition mt-2"
          >
            Cotizar gratis
          </a>
        </div>
      )}
    </header>
  )
}
