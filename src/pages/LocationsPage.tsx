import { useMemo } from 'react'
import LocationCard from '../components/cards/LocationCard'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import { buildLastSeenSummary } from '../data/dashboard'
import { includesPodo } from '../data/podo'
import { useAllRecords } from '../hooks/useAllRecords'
import { useLocations } from '../hooks/useLocations'

const LocationsPage = () => {
  const recordsQuery = useAllRecords()
  const locationsQuery = useLocations()
  const records = recordsQuery.data ?? []
  const locations = locationsQuery.data ?? []

  const lastSeenSummary = useMemo(() => buildLastSeenSummary(records), [records])
  const lastSeenCoordinateKey =
    lastSeenSummary && typeof lastSeenSummary.record.fields.coordinates === 'string'
      ? lastSeenSummary.record.fields.coordinates
      : undefined

  const locationPodoFlags = useMemo(() => {
    const result = new Map<string, boolean>()
    for (const location of locations) {
      const hasPodo = location.recordIds.some((id) => {
        const record = records.find((r) => r.id === id)
        return record ? includesPodo(record) : false
      })
      result.set(location.coordinateKey, hasPodo)
    }
    return result
  }, [locations, records])

  const isLoading = recordsQuery.isLoading || locationsQuery.isLoading
  const isError = recordsQuery.isError || locationsQuery.isError
  const errorMessage = [recordsQuery.error, locationsQuery.error].find((e) => e instanceof Error)
    ?.message

  const refetchAll = () => {
    void recordsQuery.refetch()
    void locationsQuery.refetch()
  }

  return (
    <section className="case-card p-6">
      <h2 className="font-serif text-2xl font-semibold text-slate-900">Locations</h2>
      <p className="mt-2 text-sm text-slate-600">
        Location clusters grouped by shared coordinates. Last sighting and Podo-tagged visits are
        highlighted.
      </p>

      <div className="mt-4">
        {isLoading ? <LoadingState /> : null}
        {isError ? <ErrorState message={errorMessage} onRetry={refetchAll} /> : null}
        {!isLoading && !isError && locations.length === 0 ? (
          <EmptyState message="No locations found in records." />
        ) : null}
        {!isLoading && !isError && locations.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {locations.map((location) => (
              <LocationCard
                key={location.coordinateKey}
                location={location}
                hasPodoSightings={locationPodoFlags.get(location.coordinateKey) ?? false}
                isLastSeenLocation={
                  Boolean(lastSeenCoordinateKey && location.coordinateKey === lastSeenCoordinateKey)
                }
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default LocationsPage
