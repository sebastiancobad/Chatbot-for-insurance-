'use client'

interface MetricCardProps {
  title: string
  value: number
  subtitle?: string
  trend?: { value: number; label: string; positive: boolean }
  color: string
  textColor: string
  icon: React.ReactNode
  href?: string
}

export default function MetricCard({ title, value, subtitle, trend, color, textColor, icon, href }: MetricCardProps) {
  const content = (
    <div className={`${color} rounded-2xl p-5 border border-border/50 transition hover:shadow-md ${href ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${textColor} bg-white/60`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}%
          </span>
        )}
      </div>
      <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      <p className="text-xs text-text-mid mt-1">{title}</p>
      {subtitle && <p className="text-[10px] text-text-soft mt-0.5">{subtitle}</p>}
    </div>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }
  return content
}
