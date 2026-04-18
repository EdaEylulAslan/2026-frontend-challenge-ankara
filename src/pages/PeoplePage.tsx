import PersonCard from '../components/cards/PersonCard'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import { usePeople } from '../hooks/usePeople'
import { Link } from 'react-router-dom'

const PeoplePage = () => {
  const { data, isLoading, isError, error, refetch } = usePeople()
  const people = (data ?? []).filter((person) => person.canonicalName !== 'podo')

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold text-slate-900">People</h2>
      <p className="mt-2 text-sm text-slate-600">
        Fuzzy-grouped person entities with known name variants.
      </p>

      <article className="mt-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-amber-700">
          Subject of Investigation
        </p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-600 text-lg font-semibold text-white">
              P
            </div>
            <div>
              <h3 className="text-xl font-semibold text-amber-900">Podo</h3>
              <p className="text-sm text-amber-800">Missing Subject</p>
              <p className="mt-2 text-sm text-amber-800">
                Last seen at Ankara Kalesi with Kağan · 21:11, April 18, 2026
              </p>
              <p className="mt-1 text-sm font-medium text-amber-900">
                23 records involving Podo
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-800"
          >
            View Podo&apos;s Journey
          </Link>
        </div>
      </article>

      <div className="mt-4">
        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && people.length === 0 ? (
          <EmptyState message="No people found in records." />
        ) : null}
        {!isLoading && !isError && people.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {people.map((person) => (
              <PersonCard key={person.canonicalName} person={person} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default PeoplePage
