export default function TypingIndicator() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-7 h-7 rounded-full bg-blue flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M12 2L3 7V12C3 17.5 7.4 22.3 12 23C16.6 22.3 21 17.5 21 12V7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="bg-white border border-border rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
        <span className="w-2 h-2 bg-text-soft rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-text-soft rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-text-soft rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  )
}
