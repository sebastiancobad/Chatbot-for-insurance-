'use client'

export default function FloatingChatButton() {
  return (
    <button
      className="fixed bottom-6 right-6 w-14 h-14 bg-blue text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-mid hover:scale-105 transition-all z-50"
      aria-label="Abrir chat"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
