import { useMemo, useState } from 'react'
import InvestigationMap from '../components/map/InvestigationMap'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import { buildLocationIndex } from '../data/relations'
import { buildPodosJourneyPoints } from '../data/journeyMap'
import type { InvestigationRecord } from '../data/types'
import { useAllRecords } from '../hooks/useAllRecords'

const EMPTY_RECORDS: InvestigationRecord[] = []

const MapPage = () => {
  const { data, isLoading, isError, error, refetch } = useAllRecords()
  const [showRoute, setShowRoute] = useState(true)

  const records = data ?? EMPTY_RECORDS

  const locations = useMemo(() => {
    const index = buildLocationIndex(records)
    return Object.values(index).sort((a, b) => a.coordinateKey.localeCompare(b.coordinateKey))
  }, [records])

  const journeyPoints = useMemo(() => buildPodosJourneyPoints(records), [records])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-slate-900">Map</h2>
          <p className="mt-2 text-sm text-slate-600">
            OpenStreetMap view of coordinate clusters across Ankara. Toggle Podo&apos;s traced route
            to see numbered stops and the last confirmed sighting.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 transition hover:border-amber-300 hover:bg-amber-50">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            checked={showRoute}
            onChange={(event) => setShowRoute(event.target.checked)}
          />
          <span className="font-medium">Show Podo&apos;s route</span>
        </label>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        {locations.length} locations · {journeyPoints.length} journey points with coordinates
      </p>

      <div className="mt-4">
        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && records.length === 0 ? (
          <EmptyState message="No records loaded yet." />
        ) : null}
        {!isLoading && !isError && records.length > 0 ? (
          <InvestigationMap
            locations={locations}
            journeyPoints={journeyPoints}
            showRoute={showRoute}
          />
        ) : null}
      </div>
    </section>
  )
}

export default MapPage
