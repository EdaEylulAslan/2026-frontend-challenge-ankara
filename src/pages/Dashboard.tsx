import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import PodoAvatar from '../components/PodoAvatar'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import {
  buildDashboardStats,
  buildLastSeenSummary,
  buildSuspicionScores,
  formatElapsedFromFirstCheckIn,
} from '../data/dashboard'
import { parseRecordTimestamp } from '../data/normalize'
import { useAllRecords } from '../hooks/useAllRecords'
import { useLocations } from '../hooks/useLocations'
import { usePeople } from '../hooks/usePeople'

const statCardStyles = 'rounded-lg border border-slate-200 bg-slate-50 p-3'
const rankBadgeStyles = ['bg-rose-600', 'bg-orange-500', 'bg-amber-500']

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
  const suspects = buildSuspicionScores(records).slice(0, 3)
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
      <div className="case-card p-6">
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
          <section className="case-card-critical p-5">
            <p className="text-xs uppercase tracking-wide text-amber-700">Last Seen Podo</p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <PodoAvatar size="lg" glowing alt="Podo portrait" />
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

          <section className="case-card p-5">
            <h3 className="text-lg font-semibold text-slate-900">🔍 Persons of Interest</h3>
            <p className="mt-1 text-sm text-slate-600">
              Ranked by involvement in Podo&apos;s last known hours.
            </p>

            <div className="mt-4 grid gap-3 xl:grid-cols-3">
              {suspects.map((suspect, index) => (
                <Link
                  key={suspect.canonicalName}
                  to={`/people/${encodeURIComponent(suspect.canonicalName)}`}
                  className="case-card bg-stone-50 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
                        rankBadgeStyles[index] ?? 'bg-slate-900'
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <p className="text-2xl font-bold text-slate-900">{suspect.score}</p>
                  </div>
                  <p className="mt-3 text-base font-semibold capitalize text-slate-900">
                    {suspect.canonicalName}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Also known as: {suspect.variants.join(', ')}
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-700">
                    {suspect.topReasons.map((reason) => (
                      <li key={reason}>• {reason}</li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            <div className={statCardStyles}>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Total records</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{stats.totalRecords}</p>
            </div>
            <div className={statCardStyles}>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">People entities</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{stats.peopleCount}</p>
            </div>
            <div className={statCardStyles}>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Locations</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{stats.locationCount}</p>
            </div>
            <div className={statCardStyles}>
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Sightings</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
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
