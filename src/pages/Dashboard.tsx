import { format } from 'date-fns'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import { buildDashboardStats, findLastSeenPodoRecord } from '../data/dashboard'
import { parseRecordTimestamp } from '../data/normalize'
import { useAllRecords } from '../hooks/useAllRecords'
import { useLocations } from '../hooks/useLocations'
import { usePeople } from '../hooks/usePeople'

const statCardStyles = 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm'

const Dashboard = () => {
  const recordsQuery = useAllRecords()
  const peopleQuery = usePeople()
  const locationsQuery = useLocations()

  const isLoading = recordsQuery.isLoading || peopleQuery.isLoading || locationsQuery.isLoading
  const isError = recordsQuery.isError || peopleQuery.isError || locationsQuery.isError

  const errorMessage = [recordsQuery.error, peopleQuery.error, locationsQuery.error]
    .find((error) => error instanceof Error)
    ?.message

  const records = recordsQuery.data ?? []
  const people = peopleQuery.data ?? []
  const locations = locationsQuery.data ?? []
  const stats = buildDashboardStats(records, people.length, locations.length)
  const lastSeenPodo = findLastSeenPodoRecord(records)

  const lastSeenTime =
    lastSeenPodo && typeof lastSeenPodo.fields.timestamp === 'string'
      ? format(parseRecordTimestamp(lastSeenPodo.fields.timestamp), 'dd MMM yyyy, HH:mm')
      : undefined

  const lastSeenLocation =
    lastSeenPodo && typeof lastSeenPodo.fields.location === 'string'
      ? lastSeenPodo.fields.location
      : 'Unknown location'

  const lastSeenWith =
    lastSeenPodo && typeof lastSeenPodo.fields.seenWith === 'string'
      ? lastSeenPodo.fields.seenWith
      : 'Unknown'

  const retryAll = () => {
    void recordsQuery.refetch()
    void peopleQuery.refetch()
    void locationsQuery.refetch()
  }

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">
          High-level metrics and key lead signals for the investigation.
        </p>
      </div>

      {isLoading ? <LoadingState /> : null}
      {isError ? <ErrorState message={errorMessage} onRetry={retryAll} /> : null}
      {!isLoading && !isError && records.length === 0 ? (
        <EmptyState message="No records available for dashboard metrics." />
      ) : null}

      {!isLoading && !isError && records.length > 0 ? (
        <>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className={statCardStyles}>
              <p className="text-xs uppercase tracking-wide text-slate-500">Total records</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalRecords}</p>
            </div>
            <div className={statCardStyles}>
              <p className="text-xs uppercase tracking-wide text-slate-500">People entities</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.peopleCount}</p>
            </div>
            <div className={statCardStyles}>
              <p className="text-xs uppercase tracking-wide text-slate-500">Locations</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.locationCount}</p>
            </div>
            <div className={statCardStyles}>
              <p className="text-xs uppercase tracking-wide text-slate-500">Sightings</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {stats.recordsByType.sightings}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-amber-700">Last Seen Podo</p>
            {lastSeenPodo ? (
              <>
                <p className="mt-1 text-lg font-semibold text-amber-900">{lastSeenLocation}</p>
                <p className="mt-1 text-sm text-amber-800">
                  Seen with {lastSeenWith}
                  {lastSeenTime ? ` at ${lastSeenTime}` : ''}
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-amber-800">No confirmed Podo sightings found.</p>
            )}
          </div>
        </>
      ) : null}
    </section>
  )
}

export default Dashboard
