'use client'

import { useState, useEffect } from 'react'
import DocumentManager from './DocumentManager'
import { AgencyConfig, StoredDocument } from '@/lib/types'
import { getConfig, saveConfig, getDocuments, getTotalTokenEstimate } from '@/lib/store'

export default function AdminPanel() {
  const [config, setConfig] = useState<AgencyConfig>({
    name: 'Mi Agencia de Seguros',
    slogan: 'Protegemos lo que más importa',
    faqs: [],
    lastUpdated: new Date().toISOString(),
  })
  const [documents, setDocuments] = useState<StoredDocument[]>([])
  const [newFaq, setNewFaq] = useState('')
  const [editingFaq, setEditingFaq] = useState<{ index: number; value: string } | null>(null)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'agency' | 'docs' | 'faqs' | 'stats'>('agency')

  useEffect(() => {
    setConfig(getConfig())
    setDocuments(getDocuments())
  }, [])

  const refreshDocuments = () => {
    setDocuments(getDocuments())
  }

  const handleSaveConfig = () => {
    saveConfig(config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleAddFaq = () => {
    if (!newFaq.trim()) return
    const updated = { ...config, faqs: [...config.faqs, newFaq.trim()] }
    setConfig(updated)
    saveConfig(updated)
    setNewFaq('')
  }

  const handleEditFaq = (index: number) => {
    if (!editingFaq || editingFaq.value.trim() === '') return
    const faqs = [...config.faqs]
    faqs[index] = editingFaq.value.trim()
    const updated = { ...config, faqs }
    setConfig(updated)
    saveConfig(updated)
    setEditingFaq(null)
  }

  const handleDeleteFaq = (index: number) => {
    const faqs = config.faqs.filter((_, i) => i !== index)
    const updated = { ...config, faqs }
    setConfig(updated)
    saveConfig(updated)
  }

  const totalChunks = documents.reduce((sum, d) => sum + d.chunks.length, 0)
  const totalTokens = getTotalTokenEstimate()
  const apiConfigured = true // La API key se configura via env var en el servidor

  const tabs = [
    { id: 'agency' as const, label: 'Agencia', icon: '🏢' },
    { id: 'docs' as const, label: 'Documentos', icon: '📄' },
    { id: 'faqs' as const, label: 'Preguntas', icon: '💬' },
    { id: 'stats' as const, label: 'Estadísticas', icon: '📊' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs de navegación */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-blue text-white shadow-md'
                : 'bg-white text-text-mid border border-border hover:border-blue-mid'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Datos de la Agencia */}
      {activeTab === 'agency' && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-title text-xl font-bold text-text mb-4">Datos de la Agencia</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">Nombre de la agencia</label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition"
                placeholder="Mi Agencia de Seguros"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-mid mb-1">Slogan / Descripción</label>
              <input
                type="text"
                value={config.slogan}
                onChange={(e) => setConfig({ ...config, slogan: e.target.value })}
                className="w-full px-4 py-2.5 border border-border rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition"
                placeholder="Protegemos lo que más importa"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveConfig}
                className="px-6 py-2.5 bg-blue text-white rounded-xl hover:bg-blue-mid transition font-medium"
              >
                Guardar cambios
              </button>
              {saved && (
                <span className="text-teal text-sm font-medium">Guardado correctamente</span>
              )}
            </div>
          </div>

          {/* Info sobre API Key */}
          <div className="mt-6 p-4 bg-blue-light rounded-xl">
            <h3 className="font-semibold text-text text-sm mb-2">Configuración de API Key</h3>
            <p className="text-text-mid text-sm">
              La API key de Anthropic se configura como variable de entorno <code className="bg-white px-1.5 py-0.5 rounded text-xs">ANTHROPIC_API_KEY</code> en el servidor.
            </p>
            <p className="text-text-soft text-xs mt-2">
              En Vercel: Settings → Environment Variables → Agregar ANTHROPIC_API_KEY
            </p>
          </div>
        </div>
      )}

      {/* Tab: Documentos */}
      {activeTab === 'docs' && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-title text-xl font-bold text-text mb-4">Gestión de Documentos</h2>
          <DocumentManager documents={documents} onUpdate={refreshDocuments} />
        </div>
      )}

      {/* Tab: Preguntas Frecuentes */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-title text-xl font-bold text-text mb-4">Preguntas Frecuentes</h2>
          <p className="text-text-mid text-sm mb-4">
            Estas preguntas aparecen como sugerencias en el chat del cliente.
          </p>

          {/* Lista de FAQs */}
          <div className="space-y-2 mb-4">
            {config.faqs.map((faq, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-bg rounded-xl group">
                {editingFaq?.index === i ? (
                  <>
                    <input
                      type="text"
                      value={editingFaq.value}
                      onChange={(e) => setEditingFaq({ ...editingFaq, value: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleEditFaq(i)}
                      className="flex-1 px-3 py-1.5 border border-blue rounded-lg text-sm focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleEditFaq(i)}
                      className="text-teal hover:text-teal/80 text-sm font-medium"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingFaq(null)}
                      className="text-text-soft hover:text-text-mid text-sm"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-text">{faq}</span>
                    <button
                      onClick={() => setEditingFaq({ index: i, value: faq })}
                      className="text-text-soft hover:text-blue transition opacity-0 group-hover:opacity-100"
                      title="Editar"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(i)}
                      className="text-text-soft hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                      title="Eliminar"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
                        <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {config.faqs.length === 0 && (
            <p className="text-text-soft text-sm mb-4 text-center py-4">
              No hay preguntas frecuentes configuradas.
            </p>
          )}

          {/* Agregar nueva FAQ */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newFaq}
              onChange={(e) => setNewFaq(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFaq()}
              placeholder="Escribe una nueva pregunta frecuente..."
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm text-text focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition"
            />
            <button
              onClick={handleAddFaq}
              disabled={!newFaq.trim()}
              className="px-4 py-2.5 bg-blue text-white rounded-xl hover:bg-blue-mid transition font-medium text-sm disabled:opacity-40"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {/* Tab: Estadísticas */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h2 className="font-title text-xl font-bold text-text mb-4">Estadísticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-light rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue">{documents.length}</p>
              <p className="text-xs text-text-mid mt-1">Documentos activos</p>
            </div>
            <div className="bg-blue-light rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue">{totalChunks}</p>
              <p className="text-xs text-text-mid mt-1">Chunks procesados</p>
            </div>
            <div className="bg-blue-light rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-blue">~{(totalTokens / 1000).toFixed(1)}k</p>
              <p className="text-xs text-text-mid mt-1">Tokens aprox.</p>
            </div>
            <div className={`rounded-xl p-4 text-center ${apiConfigured ? 'bg-teal-light' : 'bg-red-50'}`}>
              <p className={`text-3xl font-bold ${apiConfigured ? 'text-teal' : 'text-red-500'}`}>
                {apiConfigured ? '✓' : '✗'}
              </p>
              <p className="text-xs text-text-mid mt-1">API configurada</p>
            </div>
          </div>

          {config.lastUpdated && (
            <p className="text-text-soft text-xs mt-4">
              Última actualización: {new Intl.DateTimeFormat('es', {
                dateStyle: 'long',
                timeStyle: 'short',
              }).format(new Date(config.lastUpdated))}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
