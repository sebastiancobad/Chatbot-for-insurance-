'use client'

import { useState, useEffect } from 'react'
import { useChat } from '@/hooks/useChat'
import { getConfig, getDocuments } from '@/lib/store'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'
import LeadCaptureChips from './LeadCaptureChips'

const DEFAULT_CHIPS = [
  '¿Qué tipos de seguros ofrecen?',
  '¿Cómo reporto un siniestro?',
  '¿Cuánto cuesta un seguro de auto?',
  '¿Cómo puedo cotizar?',
]

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [chips, setChips] = useState<string[]>(DEFAULT_CHIPS)
  const [hasDocs, setHasDocs] = useState(true)

  const {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    leadStep,
    submitLeadName,
    submitLeadWhatsapp,
    resetChat,
  } = useChat()

  useEffect(() => {
    const config = getConfig()
    if (config.faqs && config.faqs.length > 0) {
      setChips(config.faqs.slice(0, 4))
    }
    setHasDocs(getDocuments().length > 0)
  }, [isOpen])

  const showWelcome = messages.length === 0

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] h-[520px] sm:h-[560px] bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-blue px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M12 2L3 7V12C3 17.5 7.4 22.3 12 23C16.6 22.3 21 17.5 21 12V7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold">Asesor Virtual</h3>
                <p className="text-white/70 text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                  En línea
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  onClick={resetChat}
                  className="text-white/70 hover:text-white transition p-1.5"
                  aria-label="Nueva conversación"
                  title="Nueva conversación"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12a9 9 0 019-9 9.75 9.75 0 017 3V3M21 12a9 9 0 01-9 9 9.75 9.75 0 01-7-3v3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition p-1.5"
                aria-label="Cerrar chat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
                  <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages area */}
          {showWelcome ? (
            <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center justify-center">
              {/* Welcome */}
              <div className="w-14 h-14 bg-blue-light rounded-full flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#004A8F" strokeWidth="1.5">
                  <path d="M12 2L3 7V12C3 17.5 7.4 22.3 12 23C16.6 22.3 21 17.5 21 12V7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12L11 14L15 10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-text font-semibold text-base mb-1">¿Cómo puedo ayudarte?</h3>
              <p className="text-text-soft text-xs text-center mb-5 max-w-[260px]">
                Pregúntame sobre seguros de auto, vida, salud, hogar y más.
              </p>

              {!hasDocs && (
                <div className="w-full mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 text-center">
                  Aún no hay documentos cargados. Las respuestas serán generales.
                </div>
              )}

              {/* Quick chips */}
              <div className="w-full space-y-2">
                {chips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="w-full text-left px-3 py-2.5 bg-gray-50 hover:bg-blue-light border border-border hover:border-blue/30 rounded-xl text-xs text-text-mid hover:text-blue transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ChatMessages messages={messages} isLoading={isLoading} />
          )}

          {/* Error banner */}
          {error && (
            <div className="mx-3 mb-1 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Lead capture */}
          <LeadCaptureChips
            leadStep={leadStep}
            onSubmitName={submitLeadName}
            onSubmitWhatsapp={submitLeadWhatsapp}
          />

          {/* Lead captured confirmation */}
          {leadStep === 'done' && (
            <div className="mx-3 mb-1 px-3 py-2 bg-teal-light border border-teal/20 rounded-lg text-xs text-teal">
              Datos recibidos. Nuestra asesora te contactará pronto.
            </div>
          )}

          {/* Input */}
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={() => sendMessage()}
            disabled={isLoading}
          />

          {/* Footer */}
          <div className="px-3 pb-2 pt-0.5">
            <p className="text-[9px] text-text-soft text-center flex items-center justify-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Respuestas basadas en documentos oficiales
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          isOpen
            ? 'bg-text hover:bg-text-mid scale-90'
            : 'bg-blue hover:bg-blue-mid hover:scale-105 animate-pulse'
        }`}
        aria-label={isOpen ? 'Cerrar chat' : 'Abrir chat'}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </>
  )
}
