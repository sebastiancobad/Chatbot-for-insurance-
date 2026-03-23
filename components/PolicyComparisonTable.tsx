'use client'

interface ComparisonRow {
  feature: string
  planA: string
  planB: string
  planAIncluded: boolean
  planBIncluded: boolean
}

interface PolicyComparisonTableProps {
  planAName: string
  planBName: string
  rows: ComparisonRow[]
  onSelectPlan: (plan: 'A' | 'B') => void
}

export default function PolicyComparisonTable({ planAName, planBName, rows, onSelectPlan }: PolicyComparisonTableProps) {
  return (
    <div className="my-2 overflow-x-auto">
      <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-blue-light">
            <th className="text-left px-3 py-2 text-text font-medium text-xs">Cobertura</th>
            <th className="text-center px-3 py-2 text-blue font-semibold text-xs">{planAName}</th>
            <th className="text-center px-3 py-2 text-blue font-semibold text-xs">{planBName}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-bg'}>
              <td className="px-3 py-2 text-text text-xs">{row.feature}</td>
              <td className="px-3 py-2 text-center text-xs">
                {row.planAIncluded ? (
                  <span className="text-green-600 font-medium">{row.planA}</span>
                ) : (
                  <span className="text-red-400">{row.planA}</span>
                )}
              </td>
              <td className="px-3 py-2 text-center text-xs">
                {row.planBIncluded ? (
                  <span className="text-green-600 font-medium">{row.planB}</span>
                ) : (
                  <span className="text-red-400">{row.planB}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onSelectPlan('A')}
          className="flex-1 py-2 bg-blue text-white text-xs rounded-lg hover:bg-blue-mid transition font-medium"
        >
          Quiero {planAName}
        </button>
        <button
          onClick={() => onSelectPlan('B')}
          className="flex-1 py-2 bg-white text-blue border border-blue text-xs rounded-lg hover:bg-blue-light transition font-medium"
        >
          Quiero {planBName}
        </button>
      </div>
    </div>
  )
}
