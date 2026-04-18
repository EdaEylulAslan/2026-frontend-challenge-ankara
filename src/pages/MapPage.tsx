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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-slate-900">Map</h2>
            <p className="mt-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-amber-900/85">
              Ankara · clusters and journey trace
            </p>
          </div>
          <div className="max-w-3xl rounded-lg border border-dashed border-amber-800/25 bg-gradient-to-br from-[#fffdf8] via-amber-50/35 to-stone-100/50 px-4 py-3 shadow-sm shadow-amber-950/5">
            <p className="font-serif text-sm leading-relaxed text-slate-800">
              Street map (OSM via Carto) with pins for every clustered location. With{' '}
              <span className="whitespace-nowrap font-medium text-amber-950">Podo&apos;s route</span>{' '}
              enabled, stops are numbered{' '}
              <span className="font-mono text-[13px] font-semibold text-slate-900">
                1 → {maxStop || '…'}
              </span>{' '}
              in time order — not map north.
            </p>
            <ul className="mt-3 space-y-2 border-t border-amber-900/10 pt-3 text-sm text-slate-700">
              <li className="flex gap-2.5">
                <span className="font-mono text-xs font-semibold text-emerald-800" aria-hidden>
                  ●
                </span>
                <span>
                  <strong className="font-medium text-slate-900">Green</strong> — first stop
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="font-mono text-xs font-semibold text-amber-800" aria-hidden>
                  ●
                </span>
                <span>
                  <strong className="font-medium text-slate-900">Amber</strong> — middle legs of the
                  route
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="font-mono text-xs font-semibold text-red-700" aria-hidden>
                  ●
                </span>
                <span>
                  <strong className="font-medium text-slate-900">Last stop (Podo portrait)</strong>{' '}
                  — last confirmed sighting on this trace
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="font-mono text-xs font-semibold text-amber-900" aria-hidden>
                  ▲
                </span>
                <span>
                  Small <strong className="font-medium text-slate-900">arrows</strong> on the orange
                  polyline show direction between consecutive stops.
                </span>
              </li>
            </ul>
          </div>
        </div>
        <label className="flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-lg border border-stone-300 bg-[#fffdf8] px-3 py-2.5 text-sm text-slate-800 shadow-sm transition hover:border-amber-400/80 hover:bg-amber-50/90 focus-within:ring-2 focus-within:ring-amber-500/40">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            checked={showRoute}
            onChange={(event) => setShowRoute(event.target.checked)}
          />
          <span className="font-medium">Show Podo&apos;s route</span>
        </label>
      </div>

      <p className="mt-3 font-mono text-[11px] text-slate-600">
        <span className="text-slate-500">Case totals:</span>{' '}
        {locations.length} location cluster{locations.length === 1 ? '' : 's'} ·{' '}
        {journeyPoints.length} journey point{journeyPoints.length === 1 ? '' : 's'} with coordinates
      </p>

      <div className="relative mt-4">
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
          <>
            <InvestigationMap
              locations={locations}
              journeyPoints={journeyPoints}
              showRoute={showRoute}
            />
            <div className="pointer-events-none absolute bottom-4 left-4 z-[1200] max-w-[min(100%-2rem,19rem)] rounded-lg border border-stone-300/95 bg-[#fffdf8]/96 px-3 py-2.5 text-[11px] text-slate-800 shadow-lg shadow-amber-950/15 ring-1 ring-black/5 backdrop-blur-sm">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-900/90">
                Legend
              </p>
              <ul className="mt-2 space-y-1.5 text-slate-800">
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-white bg-emerald-500 shadow-sm ring-1 ring-emerald-800/20" />
                  Start (stop 1)
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-white bg-amber-500 shadow-sm ring-1 ring-amber-900/20" />
                  Middle stops
                </li>
                <li className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-white bg-red-600 shadow-sm ring-2 ring-red-400/50" />
                  Last seen (Podo)
                </li>
                <li className="flex items-center gap-2 text-slate-700">
                  <span className="text-amber-800" aria-hidden>
                    ▲
                  </span>
                  Direction along route
                </li>
                {showRoute ? (
                  <li className="flex items-start gap-2 border-t border-stone-200/90 pt-2 text-slate-600">
                    <span className="mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-slate-400 bg-slate-500 shadow-sm" />
                    <span>
                      Other pins — records at coordinates{' '}
                      <strong className="font-medium text-slate-800">not</strong> on the numbered route.
                    </span>
                  </li>
                ) : null}
              </ul>
            </div>
          </>
        ) : null}
      </div>
    </section>
  )
}

export default MapPage
