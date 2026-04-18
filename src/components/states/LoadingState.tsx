interface LoadingStateProps {
  /** Taller skeleton for map viewport */
  variant?: 'default' | 'map'
}

const LoadingState = ({ variant = 'default' }: LoadingStateProps) => {
  if (variant === 'map') {
    return (
      <div
        className="animate-pulse rounded-xl border border-slate-200 bg-slate-100 shadow-inner"
        role="status"
        aria-label="Loading map"
      >
        <div className="h-[min(70vh,640px)] min-h-[420px] rounded-xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200" />
      </div>
    )
  }

  return (
    <div className="case-card p-4">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-1/4 rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-100" />
        <div className="h-4 w-1/2 rounded bg-slate-100" />
      </div>
    </div>
  )
}

export default LoadingState
