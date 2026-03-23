interface Props {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export default function StepIndicator({ currentStep, totalSteps, labels }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto mb-8">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1
        const isCompleted = step < currentStep
        const isCurrent = step === currentStep
        const isPending = step > currentStep

        return (
          <div key={step} className="flex items-center flex-1 last:flex-initial">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  isCompleted
                    ? 'bg-teal text-white'
                    : isCurrent
                    ? 'bg-blue text-white shadow-md'
                    : 'bg-gray-200 text-text-soft'
                }`}
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className={`text-[10px] mt-1 whitespace-nowrap ${isCurrent ? 'text-blue font-semibold' : isPending ? 'text-text-soft' : 'text-teal'}`}>
                {labels[i] || ''}
              </span>
            </div>
            {step < totalSteps && (
              <div className={`h-0.5 flex-1 mx-1.5 mt-[-14px] transition-colors ${isCompleted ? 'bg-teal' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
