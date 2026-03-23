'use client'

interface TypeData {
  type: string
  label: string
  count: number
  color: string
}

interface Props {
  data: TypeData[]
  total: number
}

export default function DistributionChart({ data, total }: Props) {
  const safeTotal = total || 1

  return (
    <div className="bg-white rounded-2xl border border-border p-5">
      <h3 className="font-semibold text-text text-sm mb-4">Distribución por ramo</h3>
      <div className="space-y-3">
        {data.map(d => {
          const pct = Math.round((d.count / safeTotal) * 100)
          return (
            <div key={d.type} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-mid font-medium">{d.label}</span>
                <span className="text-xs text-text-soft">{d.count} ({pct}%)</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                  style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: d.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
