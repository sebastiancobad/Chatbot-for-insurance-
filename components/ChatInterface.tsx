'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import ChatChips from './ChatChips'
import { Message, AgencyConfig, ChatSalesState, InsuranceType } from '@/lib/types'
import { getAllChunks, getConfig, getDocuments, generateId } from '@/lib/store'
import { detectIntent, getInsuranceTypeLabel } from '@/lib/intentDetector'
import { getQuoteSteps, formatQuoteSummary } from '@/lib/quoteFlows'
import { createLead } from '@/lib/leadStore'

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

const DEFAULT_SALES_STATE: ChatSalesState = {
  active: false,
  flow: 'none',
  insuranceType: null,
  captureStep: 'name',
  capturedData: {},
  quoteStepIndex: 0,
  quoteAnswers: {},
  questionCountByType: {},
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<AgencyConfig | null>(null)
  const [docCount, setDocCount] = useState(0)
  const [salesState, setSalesState] = useState<ChatSalesState>({ ...DEFAULT_SALES_STATE })
  const [showChips, setShowChips] = useState<string[] | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setConfig(getConfig())
    setDocCount(getDocuments().length)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`
    }
  }, [input])

  const addBotMessage = useCallback((content: string) => {
    const msg: Message = {
      id: generateId(),
      role: 'assistant',
      content,
      createdAt: new Date(),
    }
    setMessages(prev => [...prev, msg])
    return msg
  }, [])

  const addUserMessage = useCallback((content: string) => {
    const msg: Message = {
      id: generateId(),
      role: 'user',
      content,
      createdAt: new Date(),
    }
    setMessages(prev => [...prev, msg])
    return msg
  }, [])

  // Handle sales flow responses (lead capture + quoting)
  const handleSalesFlow = useCallback((userText: string) => {
    const state = salesState

    // --- LEAD CAPTURE FLOW ---
    if (state.flow === 'lead_capture') {
      const text = userText.trim()

      if (state.captureStep === 'name') {
        const updated = { ...state, capturedData: { ...state.capturedData, name: text }, captureStep: 'whatsapp' as const }
        setSalesState(updated)
        addBotMessage(`Gracias ${text}. ¿Me compartes tu número de WhatsApp para contactarte?`)
        return true
      }

      if (state.captureStep === 'whatsapp') {
        const updated = { ...state, capturedData: { ...state.capturedData, whatsapp: text }, captureStep: 'email' as const }
        setSalesState(updated)
        addBotMessage('¿Tienes un email donde podamos enviarte la cotización por escrito? (Si prefieres no, escribe "no")')
        return true
      }

      if (state.captureStep === 'email') {
        const email = text.toLowerCase() === 'no' ? undefined : text
        const updated = { ...state, capturedData: { ...state.capturedData, email }, captureStep: 'urgency' as const }
        setSalesState(updated)
        addBotMessage('¿Para cuándo necesitas el seguro?')
        setShowChips(['Esta semana', 'Este mes', 'Solo explorando'])
        return true
      }

      if (state.captureStep === 'urgency') {
        const urgencyMap: Record<string, 'esta_semana' | 'este_mes' | 'explorando'> = {
          'esta semana': 'esta_semana',
          'este mes': 'este_mes',
          'solo explorando': 'explorando',
        }
        const urgency = urgencyMap[text.toLowerCase()] || 'explorando'
        setShowChips(null)

        // Create the lead
        const name = state.capturedData.name || 'Sin nombre'
        const lead = createLead({
          name,
          whatsapp: state.capturedData.whatsapp || '',
          email: state.capturedData.email,
          insuranceType: state.insuranceType || 'otro',
          urgency,
          conversationSummary: messages
            .filter(m => m.role === 'user')
            .slice(-5)
            .map(m => m.content)
            .join(' | '),
          quoteData: state.quoteAnswers,
        })

        setSalesState({ ...DEFAULT_SALES_STATE })
        addBotMessage(`Perfecto ${name}, nuestra asesora te contactará hoy. ¿Hay algo más en lo que pueda ayudarte?`)
        return true
      }
    }

    // --- QUOTE FLOW ---
    if (state.flow === 'quoting' && state.insuranceType) {
      const steps = getQuoteSteps(state.insuranceType)
      const currentStep = steps[state.quoteStepIndex]

      if (currentStep) {
        const answers = { ...state.quoteAnswers, [currentStep.key]: userText.trim() }
        const nextIndex = state.quoteStepIndex + 1

        if (nextIndex < steps.length) {
          // More questions
          const nextStep = steps[nextIndex]
          setSalesState({ ...state, quoteStepIndex: nextIndex, quoteAnswers: answers })
          addBotMessage(nextStep.question)
          if (nextStep.options) {
            setShowChips(nextStep.options)
          } else {
            setShowChips(null)
          }
        } else {
          // Done with quote - show estimation
          setShowChips(null)
          const summary = formatQuoteSummary(state.insuranceType, answers)
          const typeLabel = getInsuranceTypeLabel(state.insuranceType)

          addBotMessage(
            `Con base en tu perfil, aquí tienes una estimación para seguro de ${typeLabel}:\n\n` +
            `Plan Básico — Cobertura esencial con las protecciones fundamentales.\n\n` +
            `Plan Recomendado — Ideal para tu perfil. Incluye coberturas adicionales que se ajustan a tus necesidades.\n\n` +
            `Plan Premium — Cobertura completa con todos los beneficios disponibles.\n\n` +
            `Para darte los valores exactos, déjame conectarte con nuestra asesora especializada. ¿Me compartes tu nombre para contactarte?`
          )

          // Transition to lead capture
          setSalesState({
            ...state,
            flow: 'lead_capture',
            captureStep: 'name',
            quoteAnswers: answers,
          })
        }
        return true
      }
    }

    return false
  }, [salesState, messages, addBotMessage])

  // Check if we should trigger a sales flow
  const checkAndTriggerSalesFlow = useCallback((allMessages: Message[]) => {
    if (salesState.active) return // Already in a flow

    const intent = detectIntent(allMessages)

    if (intent.wantsQuote && intent.insuranceType) {
      // Start quote flow
      const steps = getQuoteSteps(intent.insuranceType)
      if (steps.length > 0) {
        const typeLabel = getInsuranceTypeLabel(intent.insuranceType)
        setSalesState({
          ...DEFAULT_SALES_STATE,
          active: true,
          flow: 'quoting',
          insuranceType: intent.insuranceType,
        })
        addBotMessage(`Para darte una cotización precisa de seguro de ${typeLabel}, necesito hacerte unas preguntas rápidas.\n\n${steps[0].question}`)
        if (steps[0].options) {
          setShowChips(steps[0].options)
        }
        return true
      }
    }

    if (intent.hasPurchaseIntent && intent.insuranceType) {
      // Start lead capture directly
      const typeLabel = getInsuranceTypeLabel(intent.insuranceType)
      setSalesState({
        ...DEFAULT_SALES_STATE,
        active: true,
        flow: 'lead_capture',
        insuranceType: intent.insuranceType,
        captureStep: 'name',
      })
      addBotMessage(`Para darte información personalizada sobre seguro de ${typeLabel}, necesito algunos datos. ¿Me dices tu nombre completo?`)
      return true
    }

    return false
  }, [salesState, addBotMessage])

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
    setShowChips(null)

    // If we're in a sales flow, handle it locally
    if (salesState.active) {
      // Small delay to feel natural
      setTimeout(() => {
        const handled = handleSalesFlow(text.trim())
        if (!handled) {
          // If not handled, reset and send to AI
          setSalesState({ ...DEFAULT_SALES_STATE })
          sendToAI(newMessages)
        }
      }, 300)
      return
    }

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

      // After AI response, check if we should trigger sales flow
      const fullConvo = [...newMessages, assistantMessage]
      setTimeout(() => checkAndTriggerSalesFlow(fullConvo), 500)

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
  }, [messages, isLoading, config, salesState, handleSalesFlow, checkAndTriggerSalesFlow])

  // Helper to send to AI when sales flow resets
  const sendToAI = useCallback(async (msgs: Message[]) => {
    setIsLoading(true)
    try {
      const chunks = getAllChunks()
      const agencyName = config?.name || 'Mi Agencia de Seguros'
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: msgs.map(m => ({ role: m.role, content: m.content })),
          documents: chunks,
          agencyName,
        }),
      })
      if (!res.ok) throw new Error('Error')
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      const assistantMessage: Message = { id: generateId(), role: 'assistant', content: '', createdAt: new Date() }
      setMessages(prev => [...prev, assistantMessage])
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          assistantMessage.content += decoder.decode(value, { stream: true })
          setMessages(prev => prev.map(m => m.id === assistantMessage.id ? { ...m, content: assistantMessage.content } : m))
        }
      }
    } catch {
      addBotMessage('Lo siento, ocurrió un error. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }, [config, addBotMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handleFaqClick = (faq: string) => sendMessage(faq)
  const handleChipClick = (option: string) => sendMessage(option)

  const showWelcome = messages.length === 0

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 md:p-6" role="list" aria-label="Historial de conversación">
        {showWelcome ? (
          <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center py-8">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8">
              {CATEGORIES.map((cat, i) => (
                <div key={i} className="bg-white border border-border rounded-xl p-4 hover:shadow-md transition">
                  <div className="text-blue mb-2">{cat.icon}</div>
                  <h3 className="font-semibold text-text text-sm">{cat.title}</h3>
                  <p className="text-text-soft text-xs mt-1">{cat.description}</p>
                </div>
              ))}
            </div>
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
            {docCount === 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                Actualmente no hay documentos de pólizas cargados. El asistente podrá ayudarte mejor cuando el administrador suba la documentación.
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <MessageBubble key={msg.id} role={msg.role} content={msg.content} createdAt={msg.createdAt} />
            ))}
            {showChips && (
              <div className="ml-11">
                <ChatChips options={showChips} onSelect={handleChipClick} />
              </div>
            )}
            {isLoading && messages[messages.length - 1]?.role === 'user' && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

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
