import PersonCard from '../components/cards/PersonCard'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import { usePeople } from '../hooks/usePeople'

const PeoplePage = () => {
  const { data, isLoading, isError, error, refetch } = usePeople()
  const people = data ?? []

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold text-slate-900">People</h2>
      <p className="mt-2 text-sm text-slate-600">
        Fuzzy-grouped person entities with known name variants.
      </p>

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
