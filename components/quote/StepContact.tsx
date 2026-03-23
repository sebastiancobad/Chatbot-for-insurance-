'use client'

import { useState } from 'react'

export interface ContactData {
  name: string
  whatsapp: string
  email: string
  city: string
}

interface Props {
  data: ContactData
  onNext: (data: ContactData) => void
}

export default function StepContact({ data, onNext }: Props) {
  const [form, setForm] = useState<ContactData>(data)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactData, string>>>({})

  function validate(): boolean {
    const e: typeof errors = {}
    if (form.name.trim().length < 3) e.name = 'Ingresa tu nombre completo'
    if (!/^\d{7,}$/.test(form.whatsapp.replace(/\s/g, ''))) e.whatsapp = 'Ingresa un número válido (solo dígitos)'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (validate()) onNext(form)
  }

  function set(key: keyof ContactData, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
      <div>
        <label className="block text-sm font-medium text-text mb-1">Nombre completo *</label>
        <input
          type="text"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue transition ${errors.name ? 'border-red-400' : 'border-border'}`}
          placeholder="Tu nombre y apellido"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">WhatsApp *</label>
        <input
          type="tel"
          value={form.whatsapp}
          onChange={e => set('whatsapp', e.target.value.replace(/[^\d\s]/g, ''))}
          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue transition ${errors.whatsapp ? 'border-red-400' : 'border-border'}`}
          placeholder="3XX XXX XXXX"
        />
        {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">Email <span className="text-text-soft">(opcional)</span></label>
        <input
          type="email"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue transition ${errors.email ? 'border-red-400' : 'border-border'}`}
          placeholder="correo@ejemplo.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text mb-1">Ciudad <span className="text-text-soft">(opcional)</span></label>
        <input
          type="text"
          value={form.city}
          onChange={e => set('city', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue transition"
          placeholder="Bogotá, Medellín..."
        />
      </div>

      <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A99AF" strokeWidth="2" className="mt-0.5 flex-shrink-0">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <p className="text-xs text-text-soft">Tus datos están seguros. No los compartimos con terceros. Solo tu asesora los usará para contactarte.</p>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-blue text-white rounded-xl font-semibold hover:bg-blue-mid transition text-sm"
      >
        Siguiente
      </button>
    </form>
  )
}
