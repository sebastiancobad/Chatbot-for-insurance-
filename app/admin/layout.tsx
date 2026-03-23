'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getNewLeadsCount } from '@/lib/leadStore'
import LoginModal from '@/components/LoginModal'

type AdminSection = 'dashboard' | 'leads' | 'docs' | 'config'

const AdminContext = createContext<{ refreshLeads: () => void }>({ refreshLeads: () => {} })
export function useAdminContext() { return useContext(AdminContext) }

const NAV_ITEMS: { id: AdminSection; label: string; href: string; icon: JSX.Element }[] = [
  {
    id: 'dashboard', label: 'Dashboard', href: '/admin/dashboard',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    id: 'leads', label: 'Leads', href: '/admin/leads',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    id: 'docs', label: 'Documentos', href: '/admin',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    id: 'config', label: 'Configuración', href: '/admin?section=config',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
]

function getActiveSection(pathname: string): AdminSection {
  if (pathname.startsWith('/admin/leads')) return 'leads'
  if (pathname.startsWith('/admin/dashboard')) return 'dashboard'
  return 'docs'
}

const SECTION_TITLES: Record<AdminSection, string> = {
  dashboard: 'Dashboard', leads: 'Leads', docs: 'Documentos y Configuración', config: 'Configuración',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [newLeads, setNewLeads] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const active = getActiveSection(pathname)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    setNewLeads(getNewLeadsCount())
    const interval = setInterval(() => setNewLeads(getNewLeadsCount()), 5000)
    return () => clearInterval(interval)
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/verify')
      if (res.ok) setAuthenticated(true)
    } catch { /* show login */ } finally {
      setChecking(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setAuthenticated(false)
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <LoginModal onSuccess={() => setAuthenticated(true)} onClose={() => window.location.href = '/'} />
      </div>
    )
  }

  // Only render layout for sub-routes (dashboard, leads), not for root /admin
  if (pathname === '/admin') {
    return <>{children}</>
  }

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 18) return 'Buenas tardes'
    return 'Buenas noches'
  })()

  const dateStr = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <AdminContext.Provider value={{ refreshLeads: () => setNewLeads(getNewLeadsCount()) }}>
      <div className="min-h-screen bg-bg flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-0 h-screen w-60 bg-white border-r border-border flex flex-col flex-shrink-0 z-50 transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b border-border">
            <a href="/" className="flex items-center gap-2 text-text-soft hover:text-blue transition text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Volver al sitio
            </a>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => { e.preventDefault(); router.push(item.href); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition relative ${
                  active === item.id ? 'bg-blue text-white' : 'text-text-mid hover:bg-blue-light hover:text-blue'
                }`}
              >
                {item.icon}
                {item.label}
                {item.id === 'leads' && newLeads > 0 && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                    {newLeads > 9 ? '9+' : newLeads}
                  </span>
                )}
              </a>
            ))}
          </nav>
          <div className="p-3 border-t border-border">
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-text-soft hover:text-red-500 text-sm transition rounded-xl hover:bg-red-50">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 bg-white border-b border-border shadow-sm">
            <div className="flex items-center justify-between px-4 lg:px-6 py-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 text-text-mid hover:text-blue">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </button>
                <div>
                  <h1 className="font-title text-lg font-bold text-text">{SECTION_TITLES[active]}</h1>
                  {active === 'dashboard' && (
                    <p className="text-xs text-text-soft">{greeting} &middot; {dateStr}</p>
                  )}
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  )
}
