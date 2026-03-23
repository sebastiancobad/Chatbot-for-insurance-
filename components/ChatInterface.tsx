'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import { Message, DocumentChunk, AgencyConfig } from '@/lib/types'
import { getAllChunks, getConfig, getDocuments, generateId } from '@/lib/store'

// Categorías de la pantalla de bienvenida
const CATEGORIES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" strokeLinejoin="round"/>
        <path d="M12 12V22M3 7L12 12L21 7" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Coberturas',
    description: 'Consulta qué cubren tus pólizas',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round"/>
        <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Siniestros',
    description: 'Cómo reportar y dar seguimiento',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Salud & Vida',
    description: 'Beneficios y condiciones',
  },
]

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<AgencyConfig | null>(null)
  const [docCount, setDocCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Cargar configuración al montar
  useEffect(() => {
    setConfig(getConfig())
    setDocCount(getDocuments().length)
  }, [])

  // Scroll automático al nuevo mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Auto-resize del textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [input])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: text.trim(),
      createdAt: new Date(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const chunks = getAllChunks()
      const agencyName = config?.name || 'Mi Agencia de Seguros'

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          documents: chunks,
          agencyName,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Error de conexión' }))
        throw new Error(data.error || 'Error al obtener respuesta')
      }

      // Leer streaming
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const text = decoder.decode(value, { stream: true })
          assistantMessage.content += text

          setMessages(prev =>
            prev.map(m => m.id === assistantMessage.id ? { ...m, content: assistantMessage.content } : m)
          )
        }
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Error inesperado'
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `Lo siento, ocurrió un error: ${errMsg}. Por favor intenta de nuevo.`,
        createdAt: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, config])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleFaqClick = (faq: string) => {
    sendMessage(faq)
  }

  const showWelcome = messages.length === 0

  return (
    <div className="flex flex-col h-full">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6" role="list" aria-label="Historial de conversación">
        {showWelcome ? (
          <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center py-8">
            {/* Logo / ícono */}
            <div className="w-20 h-20 bg-blue rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M12 8V16M8 10V14M16 10V14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>

            <h1 className="font-title text-2xl md:text-3xl font-bold text-text mb-2">
              {config?.name || 'Mi Agencia de Seguros'}
            </h1>
            <p className="text-text-mid mb-8">
              {config?.slogan || 'Protegemos lo que más importa'}
            </p>

            {/* Categorías */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8">
              {CATEGORIES.map((cat, i) => (
                <div key={i} className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition">
                  <div className="text-blue mb-2">{cat.icon}</div>
                  <h3 className="font-semibold text-text text-sm">{cat.title}</h3>
                  <p className="text-text-soft text-xs mt-1">{cat.description}</p>
                </div>
              ))}
            </div>

            {/* FAQ chips */}
            {config?.faqs && config.faqs.length > 0 && (
              <div className="w-full">
                <p className="text-text-soft text-xs mb-3">Preguntas frecuentes</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {config.faqs.map((faq, i) => (
                    <button
                      key={i}
                      onClick={() => handleFaqClick(faq)}
                      className="px-3 py-2 bg-white border border-border rounded-full text-sm text-text-mid hover:border-blue hover:text-blue transition"
                    >
                      {faq}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Aviso si no hay documentos */}
            {docCount === 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                Actualmente no hay documentos de pólizas cargados. El asistente podrá ayudarte mejor cuando el administrador suba la documentación.
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                createdAt={msg.createdAt}
              />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-border bg-white p-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta sobre seguros..."
            rows={1}
            className="flex-1 resize-none border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-text-soft focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition"
            disabled={isLoading}
            aria-label="Escribe tu mensaje"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-11 h-11 bg-blue text-white rounded-xl flex items-center justify-center hover:bg-blue-mid transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Enviar mensaje"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" strokeLinecap="round" strokeLinejoin="round"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
