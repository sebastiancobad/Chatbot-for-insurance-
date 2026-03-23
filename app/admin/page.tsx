'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import AdminPanel from '@/components/AdminPanel'
import DashboardMetrics from '@/components/DashboardMetrics'
import LeadsTable from '@/components/LeadsTable'
import LoginModal from '@/components/LoginModal'

type AdminSection = 'dashboard' | 'leads' | 'docs' | 'config'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const [section, setSection] = useState<AdminSection>('dashboard')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/verify')
      if (res.ok) setAuthenticated(true)
    } catch {
      // Show login
    } finally {
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

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <AdminSidebar active={section} onNavigate={setSection} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
          <div className="flex items-center justify-between px-6 py-3">
            <h1 className="font-title text-lg font-bold text-text">
              {section === 'dashboard' && 'Dashboard'}
              {section === 'leads' && 'Leads'}
              {section === 'docs' && 'Documentos y Configuración'}
              {section === 'config' && 'Configuración'}
            </h1>
            <button
              onClick={handleLogout}
              className="text-text-soft hover:text-red-500 text-sm transition flex items-center gap-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Cerrar sesión
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {section === 'dashboard' && <DashboardMetrics />}
          {section === 'leads' && <LeadsTable />}
          {(section === 'docs' || section === 'config') && (
            <div className="max-w-4xl">
              <AdminPanel />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
