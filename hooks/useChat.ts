'use client'

import { useState, useCallback, useRef } from 'react'
import { getAllChunks, getConfig, generateId } from '@/lib/store'
import { createLead } from '@/lib/leadStore'
import { detectIntent } from '@/lib/intentDetector'
import type { Message, InsuranceType } from '@/lib/types'

export type LeadStep = 'none' | 'name' | 'whatsapp' | 'done'

export interface ChatState {
  messages: Message[]
  input: string
  isLoading: boolean
  leadStep: LeadStep
  leadData: { name: string; whatsapp: string }
  error: string | null
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [leadStep, setLeadStep] = useState<LeadStep>('none')
  const [leadData, setLeadData] = useState({ name: '', whatsapp: '' })
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || isLoading) return

    setInput('')
    setError(null)

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content,
      createdAt: new Date(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)

    // Detect intent
    const intent = detectIntent(updatedMessages)

    // Trigger lead capture if purchase intent and not already capturing
    if ((intent.hasPurchaseIntent || intent.wantsQuote) && leadStep === 'none') {
      setLeadStep('name')
    }

    // Get docs and config from localStorage
    const documents = getAllChunks()
    const config = getConfig()

    // Prepare API messages (only role + content)
    const apiMessages = updatedMessages.slice(-12).map(m => ({
      role: m.role,
      content: m.content,
    }))

    const botMsgId = generateId()
    setMessages(prev => [...prev, {
      id: botMsgId,
      role: 'assistant',
      content: '',
      createdAt: new Date(),
    }])

    try {
      abortRef.current = new AbortController()

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          documents,
          agencyName: config.name,
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Error de conexión' }))
        throw new Error(errData.error || `Error ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No se pudo leer la respuesta')

      const decoder = new TextDecoder()
      let botContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        botContent += decoder.decode(value, { stream: true })
        setMessages(prev =>
          prev.map(m => m.id === botMsgId ? { ...m, content: botContent } : m)
        )
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setError(msg)
      // Remove empty bot message on error
      setMessages(prev => prev.filter(m => !(m.id === botMsgId && !m.content)))
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [input, isLoading, messages, leadStep])

  const submitLeadName = useCallback((name: string) => {
    setLeadData(prev => ({ ...prev, name }))
    setLeadStep('whatsapp')
  }, [])

  const submitLeadWhatsapp = useCallback((whatsapp: string) => {
    const updatedLead = { ...leadData, whatsapp }
    setLeadData(updatedLead)
    setLeadStep('done')

    // Detect insurance type from conversation
    const intent = detectIntent(messages)
    const insuranceType: InsuranceType = intent.insuranceType ?? 'otro'

    // Build conversation summary from last user messages
    const summary = messages
      .filter(m => m.role === 'user')
      .slice(-3)
      .map(m => m.content)
      .join(' | ')

    // Save lead
    createLead({
      name: updatedLead.name || 'Visitante web',
      whatsapp,
      insuranceType,
      urgency: 'explorando',
      conversationSummary: summary,
    })
  }, [leadData, messages])

  const resetChat = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setInput('')
    setIsLoading(false)
    setLeadStep('none')
    setLeadData({ name: '', whatsapp: '' })
    setError(null)
  }, [])

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    sendMessage,
    leadStep,
    leadData,
    submitLeadName,
    submitLeadWhatsapp,
    resetChat,
  }
}
