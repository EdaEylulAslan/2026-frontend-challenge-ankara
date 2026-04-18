import { format } from 'date-fns'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PodoAvatar from '../components/PodoAvatar'
import RecordCard from '../components/cards/RecordCard'
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
import type { InvestigationRecord } from '../data/types'
import { useAllRecords } from '../hooks/useAllRecords'
import { useLocations } from '../hooks/useLocations'
import { usePeople } from '../hooks/usePeople'

const statRowClass =
  'rounded border border-stone-200/80 bg-stone-100/50 px-3 py-2 font-mono text-[11px] text-slate-500'

const suspectTiltClass = ['-rotate-2', 'rotate-1', '-rotate-1']

const toTimeNumber = (record: InvestigationRecord): number => {
  if (typeof record.fields.timestamp !== 'string') {
    return 0
  }
  const parsed = parseRecordTimestamp(record.fields.timestamp)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

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
      ? format(
          parseRecordTimestamp(lastSeenSummary.record.fields.timestamp),
          'HH:mm · MMMM d, yyyy',
        )
      : undefined

  const elapsed = formatElapsedFromFirstCheckIn(lastSeenSummary)

  const recentActivity = useMemo(() => {
    return [...records]
      .filter((record) => typeof record.fields.timestamp === 'string')
      .sort((a, b) => toTimeNumber(b) - toTimeNumber(a))
      .slice(0, 5)
  }, [records])

  const maxSuspectScore = Math.max(1, ...suspects.map((entry) => entry.score))

  const retryAll = () => {
    void recordsQuery.refetch()
    void peopleQuery.refetch()
    void locationsQuery.refetch()
  }

  return (
    <section className="space-y-6">
      {isLoading ? <LoadingState /> : null}
      {isError ? <ErrorState message={errorMessage} onRetry={retryAll} /> : null}
      {!isLoading && !isError && records.length === 0 ? (
        <EmptyState message="No records available for dashboard metrics." />
      ) : null}

      {!isLoading && !isError && records.length > 0 ? (
        <>
          <section className="case-card overflow-hidden border-2 border-dashed border-amber-700/35 bg-[#fffdf8] p-6 shadow-inner shadow-amber-950/10">
            <div className="flex flex-col gap-2 border-b border-stone-200/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-slate-600">
                  Case file · Dashboard
                </p>
                <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-slate-900">
                  Missing subject dossier
                </h2>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-600">
                  High-level signals from the field. Subjects, last sighting, and ranked leads.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
              <div className="space-y-4 border-r-0 border-stone-200/70 pr-0 lg:border-r lg:pr-8">
                <dl className="grid gap-3 font-mono text-xs text-slate-700">
                  <div className="flex flex-wrap items-baseline gap-2 border-b border-dashed border-stone-300/80 pb-2">
                    <dt className="shrink-0 uppercase tracking-wider text-slate-500">Subject</dt>
                    <dd className="font-semibold text-slate-900">Podo</dd>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2 border-b border-dashed border-stone-300/80 pb-2">
                    <dt className="shrink-0 uppercase tracking-wider text-slate-500">Status</dt>
                    <dd className="text-amber-900">Missing · active search</dd>
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <dt className="shrink-0 uppercase tracking-wider text-slate-500">File ref</dt>
                    <dd className="text-slate-800">ANO-2026-PODO</dd>
                  </div>
                </dl>
                <p className="font-serif text-sm italic text-slate-600">
                  All timestamps local to witness submissions unless noted.
                </p>
              </div>

              <div className="relative rounded-lg border border-amber-300/70 bg-amber-50/60 p-5">
                <span
                  className="absolute -right-1 -top-2 rotate-6 rounded border border-amber-800/25 bg-[#fffdf8] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-950 shadow-sm"
                  aria-hidden
                >
                  Urgent
                </span>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <PodoAvatar size="xl" glowing alt="Podo portrait" className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-amber-900">
                      Last sighting
                    </p>
                    <p className="mt-1 font-serif text-lg font-semibold text-amber-950">Podo</p>
                    <p className="text-sm font-medium text-amber-800">Missing subject</p>
                    {lastSeenSummary ? (
                      <p className="mt-3 text-sm leading-relaxed text-amber-950">
                        Last seen at{' '}
                        <span className="font-semibold">{lastSeenSummary.lastSeenLocation}</span>{' '}
                        with <span className="font-semibold">{lastSeenSummary.lastSeenWith}</span>
                        {lastSeenTime ? (
                          <>
                            <br />
                            <span className="font-mono text-xs text-amber-900/90">{lastSeenTime}</span>
                          </>
                        ) : null}
                        {elapsed ? (
                          <span className="text-slate-700">
                            {' '}
                            · {elapsed} after first check-in
                          </span>
                        ) : null}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm text-amber-900">No confirmed Podo sightings found.</p>
                    )}
                    <Link
                      to="/"
                      className="mt-4 inline-flex scale-100 rounded-lg bg-amber-800 px-4 py-2.5 font-serif text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:bg-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 active:scale-[0.99]"
                    >
                      Trace the journey
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="case-card p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg font-semibold text-slate-900">
                  Persons of interest
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Ranked by involvement in Podo&apos;s last known hours.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-3">
              {suspects.map((suspect, index) => (
                <Link
                  key={suspect.canonicalName}
                  to={`/people/${encodeURIComponent(suspect.canonicalName)}`}
                  className={`group relative block overflow-hidden rounded-lg border-2 border-stone-300 bg-[#f4efe6] p-4 shadow-sm transition hover:-translate-y-1 hover:border-amber-400/80 hover:shadow-md ${suspectTiltClass[index] ?? ''}`}
                >
                  <span
                    className="pointer-events-none absolute right-2 top-2 rotate-12 rounded border border-stone-500/50 bg-[#fffdf8] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-stone-700"
                    aria-hidden
                  >
                    Suspect
                  </span>
                  <div className="flex items-start justify-between gap-3 pr-14">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 font-mono text-sm font-bold text-white ring-2 ring-white">
                      #{index + 1}
                    </span>
                    <p className="font-mono text-2xl font-bold tabular-nums text-slate-900">
                      {suspect.score}
                    </p>
                  </div>
                  <p className="mt-4 font-serif text-lg font-semibold capitalize text-slate-900">
                    {suspect.canonicalName}
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-300/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-600 to-rose-700 transition-[width] duration-500 group-hover:from-amber-500 group-hover:to-rose-600"
                      style={{ width: `${Math.min(100, (suspect.score / maxSuspectScore) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-3 text-[11px] uppercase tracking-wide text-slate-500">
                    Aliases
                  </p>
                  <p className="mt-0.5 text-xs text-slate-700">{suspect.variants.join(', ')}</p>
                  <ul className="mt-3 space-y-1.5 text-xs italic text-slate-800">
                    {suspect.topReasons.map((reason) => (
                      <li key={reason} className="flex gap-2">
                        <span className="select-none text-slate-400" aria-hidden>
                          •
                        </span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </Link>
              ))}
            </div>
          </section>

          <section className="case-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg font-semibold text-slate-900">Recent activity</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Latest five records by submission time — cross-check on the timeline.
                </p>
              </div>
              <Link
                to="/"
                className="text-sm font-medium text-amber-900 underline decoration-amber-400/80 underline-offset-4 transition hover:text-amber-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              >
                Open full timeline
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {recentActivity.map((record) => (
                <RecordCard key={record.id} record={record} className="!transition-none hover:!translate-y-0" />
              ))}
            </div>
          </section>

          <div className="grid gap-2 border-t border-stone-200/80 pt-4 md:grid-cols-2 xl:grid-cols-4">
            <div className={statRowClass}>
              <p className="uppercase tracking-wider text-slate-500">Total records</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{stats.totalRecords}</p>
            </div>
            <div className={statRowClass}>
              <p className="uppercase tracking-wider text-slate-500">People entities</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{stats.peopleCount}</p>
            </div>
            <div className={statRowClass}>
              <p className="uppercase tracking-wider text-slate-500">Locations</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{stats.locationCount}</p>
            </div>
            <div className={statRowClass}>
              <p className="uppercase tracking-wider text-slate-500">Sightings</p>
              <p className="mt-1 text-sm font-medium text-slate-800">
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
