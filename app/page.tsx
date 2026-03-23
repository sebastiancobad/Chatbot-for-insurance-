'use client'

import { useState, useEffect } from 'react'
import ChatInterface from '@/components/ChatInterface'
import { getConfig, getDocuments } from '@/lib/store'

export default function HomePage() {
  const [agencyName, setAgencyName] = useState('Mi Agencia de Seguros')
  const [docCount, setDocCount] = useState(0)

  useEffect(() => {
    const config = getConfig()
    setAgencyName(config.name)
    setDocCount(getDocuments().length)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Header sticky */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo y nombre */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M12 8V16M8 10V14M16 10V14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <h1 className="font-title text-lg font-bold text-text leading-tight">{agencyName}</h1>
            </div>
          </div>

          {/* Badge de documentos + botón admin */}
          <div className="flex items-center gap-3">
            {docCount > 0 && (
              <span className="px-2.5 py-1 bg-teal-light text-teal text-xs font-medium rounded-full">
                {docCount} doc{docCount !== 1 ? 's' : ''} activo{docCount !== 1 ? 's' : ''}
              </span>
            )}
            <a
              href="/admin"
              className="text-text-soft hover:text-blue text-xs transition"
              title="Panel de administración"
            >
              Administrar
            </a>
          </div>
        </div>
      </header>

      {/* Chat principal */}
      <main className="flex-1 overflow-hidden max-w-4xl mx-auto w-full">
        <ChatInterface />
      </main>
    </div>
  )
}
