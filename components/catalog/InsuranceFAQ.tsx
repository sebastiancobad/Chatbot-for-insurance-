'use client'

import { useState } from 'react'
import type { InsuranceRamo } from '@/lib/insurance-content'

export default function InsuranceFAQ({ ramo }: { ramo: InsuranceRamo }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-20 bg-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-title text-3xl font-bold text-text mb-3 text-center">
          Preguntas frecuentes
        </h2>
        <p className="text-text-mid text-center mb-10">
          Resolvemos tus dudas sobre {ramo.name.toLowerCase()}.
        </p>

        <div className="space-y-3">
          {ramo.faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-text text-sm pr-4">{faq.question}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`text-text-soft flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  className="transition-all duration-200 overflow-hidden"
                  style={{ maxHeight: isOpen ? '300px' : '0px' }}
                >
                  <p className="px-5 pb-4 text-text-mid text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
