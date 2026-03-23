'use client'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

// Formatear hora del mensaje
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('es', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export default function MessageBubble({ role, content, createdAt }: MessageBubbleProps) {
  const isUser = role === 'user'

  return (
    <div
      className={`flex items-start gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
      role="listitem"
      aria-label={`Mensaje de ${isUser ? 'usuario' : 'asistente'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M12 8V16M8 10V14M16 10V14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-mid flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2"/>
            <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      {/* Burbuja de mensaje */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-blue text-white rounded-tr-sm'
              : 'bg-white text-text border border-border rounded-tl-sm'
          }`}
        >
          {/* Renderizar contenido con saltos de línea y listas básicas */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </div>
        </div>
        {/* Timestamp */}
        <span className={`text-xs text-text-soft mt-1 block ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(createdAt)}
        </span>
      </div>
    </div>
  )
}
