'use client'

import type { Message } from '@/lib/types'

function formatTime(date: Date): string {
  const d = date instanceof Date ? date : new Date(date)
  return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
}

function renderContent(text: string) {
  // Simple markdown: **bold**, lists with -
  const lines = text.split('\n')
  return lines.map((line, i) => {
    // Bold
    const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // List items
    if (line.trimStart().startsWith('- ')) {
      return (
        <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: formatted.replace(/^[\s]*-\s/, '') }} />
      )
    }
    if (!line.trim()) return <br key={i} />
    return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
  })
}

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-2 animate-in fade-in slide-in-from-bottom-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2L3 7V12C3 17.5 7.4 22.3 12 23C16.6 22.3 21 17.5 21 12V7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'ml-auto' : ''}`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'bg-blue text-white rounded-tr-md'
              : 'bg-white border border-border text-text rounded-tl-md'
          }`}
        >
          <div className="space-y-1.5">
            {message.content ? renderContent(message.content) : (
              <span className="text-text-soft italic text-xs">...</span>
            )}
          </div>
        </div>
        <p className={`text-[10px] text-text-soft mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  )
}
