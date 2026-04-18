import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import type { LocationIndexEntry } from '../../data/types'
import type { JourneyMapPoint } from '../../data/journeyMap'
import { parseCoordinateKey } from '../../utils/coordinates'

const ANKARA_CENTER: [number, number] = [39.9334, 32.8597]
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

const numberedIcon = (order: number, variant: 'amber' | 'last'): L.DivIcon => {
  const isLast = variant === 'last'
  const bg = isLast ? '#dc2626' : '#d97706'
  const pulseClass = isLast ? ' map-last-seen-marker' : ''

  return L.divIcon({
    className: `map-number-marker${pulseClass}`,
    html: `<div class="map-number-marker-inner" style="background:${bg}">${order}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -14],
  })
}

interface InvestigationMapProps {
  locations: LocationIndexEntry[]
  journeyPoints: JourneyMapPoint[]
  showRoute: boolean
}

const InvestigationMap = ({ locations, journeyPoints, showRoute }: InvestigationMapProps) => {
  const journeyCoordinateKeys = useMemo(() => {
    return new Set(
      journeyPoints
        .map((point) =>
          typeof point.record.fields.coordinates === 'string'
            ? point.record.fields.coordinates
            : '',
        )
        .filter((key) => key.length > 0),
    )
  }, [journeyPoints])

  const polylinePositions = useMemo(
    () => journeyPoints.map((point) => point.position),
    [journeyPoints],
  )

  const locationMarkers = useMemo(() => {
    if (showRoute) {
      return locations.filter((loc) => !journeyCoordinateKeys.has(loc.coordinateKey))
    }
    return locations
  }, [journeyCoordinateKeys, locations, showRoute])

  const lastJourneyRecordId =
    journeyPoints.length > 0 ? journeyPoints[journeyPoints.length - 1]?.record.id : undefined

  return (
    <MapContainer
      center={ANKARA_CENTER}
      zoom={13}
      className="z-0 h-[min(70vh,640px)] w-full rounded-xl border border-slate-200"
      scrollWheelZoom
    >
      <TileLayer attribution={OSM_ATTRIBUTION} url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {locationMarkers.map((location) => {
        const parsed = parseCoordinateKey(location.coordinateKey)
        if (!parsed) {
          return null
        }
        const title = location.names[0] ?? 'Unnamed location'
        const count = location.recordIds.length

        return (
          <Marker key={location.coordinateKey} position={parsed}>
            <Popup>
              <div className="min-w-[10rem] text-slate-900">
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs text-slate-600">{count} related records</p>
                <Link
                  className="mt-2 inline-block text-xs font-medium text-amber-700 underline transition hover:text-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                  to={`/locations/${encodeURIComponent(location.coordinateKey)}`}
                >
                  View records
                </Link>
              </div>
            </Popup>
          </Marker>
        )
      })}

      {showRoute && journeyPoints.length > 1 ? (
        <Polyline
          pathOptions={{
            color: '#f59e0b',
            weight: 3,
            dashArray: '10 8',
            lineCap: 'round',
          }}
          positions={polylinePositions}
        />
      ) : null}

      {showRoute
        ? journeyPoints.map((point) => {
            const isLast = point.record.id === lastJourneyRecordId
            const icon = numberedIcon(point.order, isLast ? 'last' : 'amber')
            return (
              <Marker key={`journey-${point.record.id}`} position={point.position} icon={icon}>
                <Popup>
                  <div className="min-w-[10rem] text-slate-900">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                      Podo&apos;s journey · Stop {point.order}
                    </p>
                    {isLast ? (
                      <p className="mt-1 text-xs font-semibold text-red-700">Last seen</p>
                    ) : null}
                    <p className="mt-1 text-sm font-medium">
                      {typeof point.record.fields.location === 'string'
                        ? point.record.fields.location
                        : 'Location'}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {typeof point.record.fields.timestamp === 'string'
                        ? point.record.fields.timestamp
                        : ''}
                    </p>
                    <Link
                      className="mt-2 inline-block text-xs font-medium text-amber-700 underline transition hover:text-amber-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                      to={`/locations/${encodeURIComponent(
                        String(point.record.fields.coordinates ?? ''),
                      )}`}
                    >
                      View records
                    </Link>
                  </div>
                </Popup>
              </Marker>
            )
          })
        : null}
    </MapContainer>
  )
}

export default InvestigationMap
