interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

const ErrorState = ({
  message = 'Something went wrong while loading records.',
  onRetry,
}: ErrorStateProps) => {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
      <p className="text-sm text-rose-700">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-800"
        >
          Retry
        </button>
      ) : null}
    </div>
  )
}

export default ErrorState
