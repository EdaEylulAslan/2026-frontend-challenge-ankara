import LocationCard from '../components/cards/LocationCard'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import { useLocations } from '../hooks/useLocations'

const LocationsPage = () => {
  const { data, isLoading, isError, error, refetch } = useLocations()
  const locations = data ?? []

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold text-slate-900">Locations</h2>
      <p className="mt-2 text-sm text-slate-600">
        Location clusters grouped by shared coordinates.
      </p>

      <div className="mt-4">
        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && locations.length === 0 ? (
          <EmptyState message="No locations found in records." />
        ) : null}
        {!isLoading && !isError && locations.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {locations.map((location) => (
              <LocationCard key={location.coordinateKey} location={location} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default LocationsPage
