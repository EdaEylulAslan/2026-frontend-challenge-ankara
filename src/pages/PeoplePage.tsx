import { format } from 'date-fns'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import PersonCard from '../components/cards/PersonCard'
import PodoAvatar from '../components/PodoAvatar'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import { buildLastSeenSummary, buildSuspicionScores } from '../data/dashboard'
import { includesPodo } from '../data/podo'
import { parseRecordTimestamp } from '../data/normalize'
import { useAllRecords } from '../hooks/useAllRecords'
import { usePeople } from '../hooks/usePeople'

const suspicionLevelFromScore = (score: number): 'high' | 'medium' | 'low' | 'none' => {
  if (score >= 8) {
    return 'high'
  }
  if (score >= 3) {
    return 'medium'
  }
  if (score >= 1) {
    return 'low'
  }

  return 'none'
}

const PeoplePage = () => {
  const recordsQuery = useAllRecords()
  const peopleQuery = usePeople()
  const records = recordsQuery.data ?? []
  const people = (peopleQuery.data ?? []).filter((person) => person.canonicalName !== 'podo')

  const lastSeenSummary = useMemo(() => buildLastSeenSummary(records), [records])
  const suspicionByName = useMemo(() => {
    const map = new Map<string, number>()
    for (const entry of buildSuspicionScores(records)) {
      map.set(entry.canonicalName, entry.score)
    }
    return map
  }, [records])

  const podoRecordCount = useMemo(() => records.filter(includesPodo).length, [records])

  const lastSeenDescription = useMemo(() => {
    if (!lastSeenSummary || typeof lastSeenSummary.record.fields.timestamp !== 'string') {
      return 'No confirmed sighting captured in the dataset.'
    }

    const formatted = format(
      parseRecordTimestamp(lastSeenSummary.record.fields.timestamp),
      'HH:mm · MMMM d, yyyy',
    )

    return `Last seen at ${lastSeenSummary.lastSeenLocation} with ${lastSeenSummary.lastSeenWith} · ${formatted}`
  }, [lastSeenSummary])

  const isLoading = recordsQuery.isLoading || peopleQuery.isLoading
  const isError = recordsQuery.isError || peopleQuery.isError
  const errorMessage = [recordsQuery.error, peopleQuery.error].find((e) => e instanceof Error)
    ?.message

  const refetchAll = () => {
    void recordsQuery.refetch()
    void peopleQuery.refetch()
  }

  return (
    <section className="case-card p-6">
      <h2 className="font-serif text-2xl font-semibold text-slate-900">People</h2>
      <p className="mt-2 text-sm text-slate-600">
        Fuzzy-grouped person entities with known name variants.
      </p>

      <article className="relative mt-4 overflow-hidden rounded-xl border-2 border-amber-400/90 bg-gradient-to-br from-amber-50 via-[#fffdf8] to-stone-100/80 p-5 shadow-md shadow-amber-900/15">
        <div className="pointer-events-none absolute -right-8 -top-6 rotate-[-8deg] font-mono text-[10rem] font-bold leading-none text-amber-200/40">
          Missing
        </div>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-900">
          Subject of investigation
        </p>
        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <PodoAvatar size="xl" glowing alt="Podo missing subject" />
            <div>
              <h3 className="font-serif text-xl font-semibold text-amber-950">Podo</h3>
              <p className="text-sm font-medium text-amber-800">Missing subject</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-amber-950">{lastSeenDescription}</p>
              <p className="mt-2 font-mono text-xs text-amber-900/80">
                {podoRecordCount} record{podoRecordCount === 1 ? '' : 's'} involving Podo
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex shrink-0 rounded-lg bg-amber-800 px-4 py-2.5 text-center font-serif text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:bg-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 active:scale-[0.99]"
          >
            View Podo&apos;s journey
          </Link>
        </div>
      </article>

      <div className="mt-4">
        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState message={errorMessage} onRetry={refetchAll} />
        ) : null}
        {!isLoading && !isError && people.length === 0 ? (
          <EmptyState message="No people found in records." />
        ) : null}
        {!isLoading && !isError && people.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {people.map((person) => (
              <PersonCard
                key={person.canonicalName}
                person={person}
                suspicionLevel={suspicionLevelFromScore(suspicionByName.get(person.canonicalName) ?? 0)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default PeoplePage
