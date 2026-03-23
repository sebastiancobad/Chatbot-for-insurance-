'use client'

// Shared form field components for quote step forms

interface RadioGroupProps {
  label: string
  name: string
  options: string[]
  value: string
  onChange: (val: string) => void
}

export function RadioGroup({ label, name, options, value, onChange }: RadioGroupProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-text mb-2">{label}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map(opt => (
          <label
            key={opt}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
              value === opt
                ? 'border-blue bg-blue-light text-blue font-medium'
                : 'border-border bg-white hover:border-blue/40 text-text-mid'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              value === opt ? 'border-blue' : 'border-text-soft'
            }`}>
              {value === opt && <span className="w-2 h-2 rounded-full bg-blue" />}
            </span>
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

interface CheckboxGroupProps {
  label: string
  options: string[]
  value: string[]
  onChange: (val: string[]) => void
}

export function CheckboxGroup({ label, options, value, onChange }: CheckboxGroupProps) {
  function toggle(opt: string) {
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt])
  }

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-text mb-2">{label}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map(opt => (
          <label
            key={opt}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
              value.includes(opt)
                ? 'border-blue bg-blue-light text-blue font-medium'
                : 'border-border bg-white hover:border-blue/40 text-text-mid'
            }`}
          >
            <input
              type="checkbox"
              checked={value.includes(opt)}
              onChange={() => toggle(opt)}
              className="sr-only"
            />
            <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              value.includes(opt) ? 'border-blue bg-blue' : 'border-text-soft'
            }`}>
              {value.includes(opt) && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

interface SelectFieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  options: { label: string; value: string }[]
  placeholder?: string
}

export function SelectField({ label, value, onChange, options, placeholder }: SelectFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue transition ${!value ? 'text-text-soft' : 'text-text'}`}
      >
        <option value="">{placeholder ?? 'Selecciona...'}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

interface NumberFieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  min?: number
  max?: number
  placeholder?: string
}

export function NumberField({ label, value, onChange, min, max, placeholder }: NumberFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        min={min}
        max={max}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue transition"
      />
    </div>
  )
}
