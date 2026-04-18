import PodoAvatar from '../PodoAvatar'

interface EmptyStateProps {
  message?: string
}

const EmptyState = ({
  message = "No records match — Podo's trail goes cold here 🔍",
}: EmptyStateProps) => {
  return (
    <div className="case-card rounded-xl border-dashed p-6 text-center">
      <div className="mx-auto mb-3 w-fit">
        <PodoAvatar size="md" alt="Podo trail clue" className="grayscale-[45%] saturate-75" />
      </div>
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  )
}

export default EmptyState
