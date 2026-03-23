'use client'

import { useEffect, useState } from 'react'
import { useInView } from '@/hooks/useInView'

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView()

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-blue-light" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <h1 className="font-title text-4xl sm:text-5xl lg:text-[56px] font-bold text-text leading-tight mb-6">
              Tu tranquilidad,<br />
              <span className="text-blue">nuestra mision.</span>
            </h1>
            <p className="text-lg text-text-mid mb-8 max-w-lg mx-auto lg:mx-0">
              Somos una agencia independiente que trabaja para ti, no para las aseguradoras. Comparamos las mejores opciones del mercado para proteger lo que mas importa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <a
                href="/cotizar"
                className="px-8 py-3.5 bg-blue text-white rounded-xl font-semibold hover:bg-blue-mid transition shadow-lg shadow-blue/20 text-center"
              >
                Cotizar ahora
              </a>
              <a
                href={`https://wa.me/573000000000?text=${encodeURIComponent('Hola, me gustaría hablar con un asesor de seguros.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 border-2 border-blue text-blue rounded-xl font-semibold hover:bg-blue-light transition text-center"
              >
                Hablar con un asesor
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              <StatItem icon={<ShieldCheck />} value={<AnimatedCounter target={500} suffix="+" />} label="Clientes protegidos" />
              <StatItem icon={<Building />} value={<AnimatedCounter target={10} />} label="Aseguradoras" />
              <StatItem icon={<Clock />} value={<AnimatedCounter target={15} />} label="Anos de experiencia" />
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-96 h-96">
              {/* Shield shape */}
              <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
                <defs>
                  <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#004A8F" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#1A6BC4" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                {/* Large shield */}
                <path d="M200 40L60 110V220C60 310 200 380 200 380S340 310 340 220V110L200 40Z" fill="url(#shieldGrad)" stroke="#004A8F" strokeWidth="2" strokeOpacity="0.3" />
                {/* Inner shield */}
                <path d="M200 80L100 130V210C100 280 200 340 200 340S300 280 300 210V130L200 80Z" fill="url(#shieldGrad)" stroke="#1A6BC4" strokeWidth="1.5" strokeOpacity="0.4" />
                {/* Check */}
                <path d="M160 200L185 225L245 165" stroke="#004A8F" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                {/* Family silhouettes */}
                <circle cx="170" cy="270" r="12" fill="#004A8F" fillOpacity="0.2" />
                <rect x="162" y="284" width="16" height="24" rx="4" fill="#004A8F" fillOpacity="0.2" />
                <circle cx="200" cy="260" r="14" fill="#004A8F" fillOpacity="0.25" />
                <rect x="190" y="276" width="20" height="28" rx="4" fill="#004A8F" fillOpacity="0.25" />
                <circle cx="230" cy="270" r="12" fill="#004A8F" fillOpacity="0.2" />
                <rect x="222" y="284" width="16" height="24" rx="4" fill="#004A8F" fillOpacity="0.2" />
                {/* Small child */}
                <circle cx="200" cy="295" r="8" fill="#004A8F" fillOpacity="0.15" />
                <rect x="194" y="304" width="12" height="16" rx="3" fill="#004A8F" fillOpacity="0.15" />
              </svg>
              {/* Decorative circles */}
              <div className="absolute top-8 right-8 w-16 h-16 bg-teal/10 rounded-full" />
              <div className="absolute bottom-16 left-4 w-10 h-10 bg-blue/10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatItem({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-10 h-10 bg-blue-light rounded-lg flex items-center justify-center text-blue">
        {icon}
      </div>
      <div>
        <p className="text-xl font-bold text-text">{value}</p>
        <p className="text-xs text-text-soft">{label}</p>
      </div>
    </div>
  )
}

function ShieldCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L3 7V12C3 17.5 7.4 22.3 12 23C16.6 22.3 21 17.5 21 12V7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12L11 14L15 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Building() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="2" width="16" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22V12H15V22M9 6H9.01M15 6H15.01M9 10H9.01M15 10H15.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Clock() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6V12L16 14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
