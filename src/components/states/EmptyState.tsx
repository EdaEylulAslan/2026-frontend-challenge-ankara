interface EmptyStateProps {
  message?: string
}

const EmptyState = ({ message = 'No records match.' }: EmptyStateProps) => {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  )
}

export default EmptyState
