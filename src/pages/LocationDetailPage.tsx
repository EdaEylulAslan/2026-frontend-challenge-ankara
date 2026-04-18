import { useParams } from 'react-router-dom'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import TimelineView from '../components/timeline/TimelineView'
import { useLocationDetail } from '../hooks/useLocationDetail'

const LocationDetailPage = () => {
  const { coords } = useParams()
  const { data, isLoading, isError, error, refetch } = useLocationDetail(coords)

  return (
    <section className="case-card p-6">
      <h2 className="font-serif text-2xl font-semibold text-slate-900">Location Detail</h2>
      <p className="mt-2 text-sm text-slate-600">Records reported at this coordinate cluster.</p>

      <div className="mt-4">
        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && !data ? (
          <EmptyState message={`No records found for ${coords ?? 'this location'}.`} />
        ) : null}
        {!isLoading && !isError && data ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">
                {data.names[0] ?? 'Unnamed location'}
              </p>
              <p className="mt-1 text-xs text-slate-600">{data.coordinateKey}</p>
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

export default LocationDetailPage
