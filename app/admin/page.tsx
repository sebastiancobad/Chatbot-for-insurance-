'use client'

import { useState, useEffect } from 'react'
import AdminPanel from '@/components/AdminPanel'
import LoginModal from '@/components/LoginModal'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  // Verificar si ya está autenticado (cookie existe)
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/verify')
      if (res.ok) {
        setAuthenticated(true)
      }
    } catch {
      // Error de red, mostrar login
    } finally {
      setChecking(false)
    }
  }

  const handleLoginSuccess = () => {
    setAuthenticated(true)
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
        <LoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => window.location.href = '/'}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header del admin */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="/" className="text-text-soft hover:text-blue transition" title="Volver al chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <h1 className="font-title text-lg font-bold text-text">Panel de Administración</h1>
          </div>
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

      {/* Panel principal */}
      <main className="p-4 md:p-8">
        <AdminPanel />
      </main>
    </div>
  )
}
