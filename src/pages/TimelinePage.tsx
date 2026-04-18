import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import TimelineView from '../components/timeline/TimelineView'
import { useAllRecords } from '../hooks/useAllRecords'

const TimelinePage = () => {
  const { data, isLoading, isError, error, refetch } = useAllRecords()

  const records = data ?? []

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold text-slate-900">Timeline</h2>
      <p className="mt-2 text-sm text-slate-600">
        Chronological view of all submitted records across forms.
      </p>

      <div className="mt-4">
        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && records.length === 0 ? <EmptyState /> : null}
        {!isLoading && !isError && records.length > 0 ? (
          <TimelineView records={records} />
        ) : null}
      </div>
    </section>
  )
}

export default TimelinePage
