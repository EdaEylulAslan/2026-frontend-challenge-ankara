import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import {
  buildDashboardStats,
  buildLastSeenSummary,
  formatElapsedFromFirstCheckIn,
} from '../data/dashboard'
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
  const lastSeenSummary = buildLastSeenSummary(records)

  const lastSeenTime =
    lastSeenSummary && typeof lastSeenSummary.record.fields.timestamp === 'string'
      ? format(parseRecordTimestamp(lastSeenSummary.record.fields.timestamp), 'dd MMM yyyy, HH:mm')
      : undefined

  const elapsed = formatElapsedFromFirstCheckIn(lastSeenSummary)

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
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-amber-700">Last Seen Podo</p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-600 text-xl font-semibold text-white">
                  P
                </div>
                <div>
                  <p className="text-xl font-semibold text-amber-900">Podo</p>
                  <p className="text-sm text-amber-800">Missing Subject</p>
                  {lastSeenSummary ? (
                    <p className="mt-2 text-sm text-amber-900">
                      Last seen at <strong>{lastSeenSummary.lastSeenLocation}</strong> with{' '}
                      <strong>{lastSeenSummary.lastSeenWith}</strong>
                      {lastSeenTime ? ` · ${lastSeenTime}` : ''}
                      {elapsed ? ` · ${elapsed} after first check-in` : ''}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-amber-800">
                      No confirmed Podo sightings found.
                    </p>
                  )}
                </div>
              </div>
              <Link
                to="/"
                className="inline-flex rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-800"
              >
                View Journey
              </Link>
            </div>
          </section>

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
        </>
      ) : null}
    </section>
  )
}

export default Dashboard
