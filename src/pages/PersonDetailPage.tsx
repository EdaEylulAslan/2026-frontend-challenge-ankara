import { useParams } from 'react-router-dom'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import TimelineView from '../components/timeline/TimelineView'
import { usePersonDetail } from '../hooks/usePersonDetail'

const PersonDetailPage = () => {
  const { canonicalName } = useParams()
  const { data, isLoading, isError, error, refetch } = usePersonDetail(canonicalName)

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold text-slate-900">Person Detail</h2>
      <p className="mt-2 text-sm text-slate-600">Records associated with this person entity.</p>

      <div className="mt-4">
        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && !data ? (
          <EmptyState message={`No records found for ${canonicalName ?? 'this person'}.`} />
        ) : null}
        {!isLoading && !isError && data ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold capitalize text-slate-900">
                {data.person.canonicalName}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Also known as: {data.person.variants.join(', ')}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {data.records.length} related records
              </p>
            </div>
            <TimelineView records={data.records} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default PersonDetailPage
