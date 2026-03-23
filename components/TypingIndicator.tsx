'use client'

// Indicador de escritura animado (3 puntos)
export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      {/* Avatar del bot */}
      <div className="w-8 h-8 rounded-full bg-blue flex items-center justify-center flex-shrink-0">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M12 8V16M8 10V14M16 10V14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      {/* Burbuja con puntos animados */}
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-border">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-text-soft rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 bg-text-soft rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 bg-text-soft rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
