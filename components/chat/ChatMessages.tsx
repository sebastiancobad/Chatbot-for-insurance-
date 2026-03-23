'use client'

import { useEffect, useRef } from 'react'
import type { Message } from '@/lib/types'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export default function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
      {messages.map(msg => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
        <TypingIndicator />
      )}
      <div ref={bottomRef} />
    </div>
  )
}
