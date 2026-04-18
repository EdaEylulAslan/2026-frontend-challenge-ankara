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

  const maxStop = journeyPoints.length

  return (
    <section className="mx-auto w-full max-w-[1400px] case-card p-4 sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-slate-900">Map</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            OpenStreetMap view of coordinate clusters across Ankara. Numbers follow{' '}
            <strong className="font-medium text-slate-800">chronological order</strong> (1 →{' '}
            {maxStop || '…'}). Orange arrows on the line show direction between stops; green is the
            first stop, red is the last confirmed sighting.
          </p>
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 transition hover:border-amber-300 hover:bg-amber-50 focus-within:ring-2 focus-within:ring-amber-500/40">
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

      <div className="mt-3 flex flex-wrap items-center gap-4 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2 text-xs text-slate-700">
        <span className="font-medium text-slate-600">Legend</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full border border-white bg-emerald-600 shadow-sm" />
          Start (stop 1)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full border border-white bg-amber-600 shadow-sm" />
          Middle stops
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full border border-white bg-red-600 shadow-sm ring-2 ring-red-200" />
          Last seen
        </span>
        <span className="inline-flex items-center gap-1.5 text-slate-600">
          <span className="text-amber-900" aria-hidden>
            ▲
          </span>
          Direction along route
        </span>
      </div>

      <div className="mt-4">
        {isLoading ? <LoadingState variant="map" /> : null}
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
