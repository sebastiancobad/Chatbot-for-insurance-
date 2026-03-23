'use client'

interface ChatChipsProps {
  options: string[]
  onSelect: (option: string) => void
}

export default function ChatChips({ options, onSelect }: ChatChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-1">
      {options.map((option, i) => (
        <button
          key={i}
          onClick={() => onSelect(option)}
          className="px-3 py-1.5 bg-white border border-blue/30 text-blue text-sm rounded-full hover:bg-blue-light hover:border-blue transition"
        >
          {option}
        </button>
      ))}
    </div>
  )
}
