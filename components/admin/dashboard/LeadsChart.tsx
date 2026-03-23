'use client'

import { useState } from 'react'

interface WeekData {
  label: string
  count: number
}

interface Props {
  data: WeekData[]
}

export default function LeadsChart({ data }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const maxCount = Math.max(1, ...data.map(d => d.count))

  const svgW = 300
  const svgH = 160
  const barW = 40
  const gap = (svgW - data.length * barW) / (data.length + 1)
  const chartH = svgH - 30 // space for labels

  return (
    <div className="bg-white rounded-2xl border border-border p-5">
      <h3 className="font-semibold text-text text-sm mb-4">Leads por semana</h3>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(pct => (
          <line
            key={pct}
            x1="0" y1={chartH - chartH * pct}
            x2={svgW} y2={chartH - chartH * pct}
            stroke="#EEE" strokeWidth="0.5"
          />
        ))}

        {data.map((d, i) => {
          const x = gap + i * (barW + gap)
          const barHeight = Math.max(2, (d.count / maxCount) * (chartH - 10))
          const y = chartH - barHeight
          const isHovered = hoveredIndex === i

          return (
            <g key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Bar */}
              <rect
                x={x} y={y} width={barW} height={barHeight}
                rx={4}
                fill={isHovered ? '#1A6BC4' : '#004A8F'}
                className="transition-all duration-200"
              />
              {/* Count label */}
              <text
                x={x + barW / 2} y={y - 6}
                textAnchor="middle"
                fill="#4A5568"
                fontSize="11"
                fontWeight="600"
              >
                {d.count}
              </text>
              {/* Week label */}
              <text
                x={x + barW / 2} y={svgH - 4}
                textAnchor="middle"
                fill="#8A99AF"
                fontSize="10"
              >
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
