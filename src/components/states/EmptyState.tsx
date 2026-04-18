import PodoAvatar from '../PodoAvatar'

interface EmptyStateProps {
  message?: string
  subtitle?: string
  /** When set, shows a primary action below the subtitle */
  actionLabel?: string
  onAction?: () => void
  /** Defaults to true */
  showIllustration?: boolean
}

const EmptyState = ({
  message = "No records match — Podo's trail goes cold here 🔍",
  subtitle,
  actionLabel,
  onAction,
  showIllustration = true,
}: EmptyStateProps) => {
  return (
    <div className="case-card rounded-xl border-dashed p-6 text-center">
      {showIllustration ? (
        <div className="mx-auto mb-3 w-fit">
          <PodoAvatar size="md" alt="Podo trail clue" className="grayscale-[45%] saturate-75" />
        </div>
      ) : null}
      <p className="text-sm font-medium text-slate-800">{message}</p>
      {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex rounded-lg border border-amber-700/40 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-950 transition hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export default EmptyState
