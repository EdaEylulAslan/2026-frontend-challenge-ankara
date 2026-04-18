import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
} from 'react-leaflet'
import { PODO_IMAGE_URL } from '../../constants/podoAsset'
import type { LocationIndexEntry } from '../../data/types'
import type { JourneyMapPoint } from '../../data/journeyMap'
import { parseCoordinateKey } from '../../utils/coordinates'
import { bearingBetween, midpoint } from '../../utils/geo'
import MapViewController from './MapViewController'

const ANKARA_CENTER: [number, number] = [39.9334, 32.8597]
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

type JourneyMarkerVariant = 'single' | 'start' | 'waypoint' | 'last'

const numberedIcon = (order: number, variant: JourneyMarkerVariant): L.DivIcon => {
  if (variant === 'last' || variant === 'single') {
    return L.divIcon({
      className: 'map-podo-marker-wrap',
      html: `<div class="map-podo-marker map-last-seen-marker"><img src="${PODO_IMAGE_URL}" alt="Podo marker" /><span class="map-podo-marker-badge">${order}</span></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    })
  }

  let bg = '#d97706'
  let extraClass = ''

  if (variant === 'start') {
    bg = '#059669'
    extraClass = ' map-start-marker'
  }
  return L.divIcon({
    className: `map-number-marker${extraClass}`,
    html: `<div class="map-number-marker-inner" style="background:${bg}">${order}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

const arrowIcon = (bearingDeg: number): L.DivIcon => {
  const normalized = ((bearingDeg % 360) + 360) % 360
  return L.divIcon({
    className: 'map-route-arrow-wrap',
    html: `<div class="map-route-arrow" style="transform:rotate(${normalized}deg)" aria-hidden="true">▲</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
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

  const journeyPositions = useMemo(
    () => journeyPoints.map((point) => point.position),
    [journeyPoints],
  )

  const locationPositions = useMemo(
    () =>
      locations
        .map((loc) => parseCoordinateKey(loc.coordinateKey))
        .filter((pos): pos is [number, number] => pos !== undefined),
    [locations],
  )

  const segmentArrows = useMemo(() => {
    if (!showRoute || journeyPoints.length < 2) {
      return []
    }

    const positions = journeyPoints.map((point) => point.position)
    const items: { key: string; position: [number, number]; bearing: number }[] = []

    for (let i = 0; i < positions.length - 1; i += 1) {
      const a = positions[i]
      const b = positions[i + 1]
      items.push({
        key: `arrow-${i}`,
        position: midpoint(a, b),
        bearing: bearingBetween(a, b),
      })
    }

    return items
  }, [journeyPoints, showRoute])

  const locationMarkers = useMemo(() => {
    if (showRoute) {
      return locations.filter((loc) => !journeyCoordinateKeys.has(loc.coordinateKey))
    }
    return locations
  }, [journeyCoordinateKeys, locations, showRoute])

  const lastJourneyRecordId =
    journeyPoints.length > 0 ? journeyPoints[journeyPoints.length - 1]?.record.id : undefined

  const totalStops = journeyPoints.length

  return (
    <MapContainer
      center={ANKARA_CENTER}
      zoom={13}
      className="z-0 h-[min(70vh,640px)] w-full rounded-xl border border-slate-200 min-h-[420px] transition-shadow focus-within:ring-2 focus-within:ring-amber-500/30"
      scrollWheelZoom
    >
      <MapViewController
        showRoute={showRoute}
        journeyPositions={journeyPositions}
        locationPositions={locationPositions}
      />

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
        <>
          <Polyline
            pathOptions={{
              color: '#fdba74',
              weight: 12,
              opacity: 0.45,
              lineCap: 'round',
              lineJoin: 'round',
            }}
            positions={polylinePositions}
          />
          <Polyline
            pathOptions={{
              color: '#9a3412',
              weight: 5,
              opacity: 0.95,
              lineCap: 'round',
              lineJoin: 'round',
            }}
            positions={polylinePositions}
          />
        </>
      ) : null}

      {showRoute
        ? segmentArrows.map((arrow) => (
            <Marker
              key={arrow.key}
              position={arrow.position}
              icon={arrowIcon(arrow.bearing)}
              interactive={false}
              zIndexOffset={-200}
            />
          ))
        : null}

      {showRoute
        ? journeyPoints.map((point) => {
            const isLast = point.record.id === lastJourneyRecordId
            const isFirst = point.order === 1
            const variant: JourneyMarkerVariant =
              totalStops === 1 ? 'single' : isLast ? 'last' : isFirst ? 'start' : 'waypoint'

            const icon = numberedIcon(point.order, variant)

            const tooltipText =
              totalStops === 1
                ? 'Start & last seen'
                : isFirst
                  ? 'Start here'
                  : isLast
                    ? 'Last seen'
                    : undefined

            return (
              <Marker
                key={`journey-${point.record.id}`}
                position={point.position}
                icon={icon}
                zIndexOffset={600}
              >
                {tooltipText ? (
                  <Tooltip permanent direction="top" offset={[0, -10]} opacity={0.95}>
                    <span className="text-xs font-semibold text-slate-800">{tooltipText}</span>
                  </Tooltip>
                ) : null}
                <Popup>
                  <div className="min-w-[10rem] text-slate-900">
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                      Podo&apos;s journey · Stop {point.order} of {totalStops}
                    </p>
                    {totalStops === 1 ? (
                      <p className="mt-1 text-xs font-medium text-slate-700">
                        Only coordinate with a timestamp on this route.
                      </p>
                    ) : null}
                    {totalStops > 1 && isFirst ? (
                      <p className="mt-1 text-xs font-semibold text-emerald-700">
                        Chronological start
                      </p>
                    ) : null}
                    {totalStops > 1 && isLast ? (
                      <p className="mt-1 text-xs font-semibold text-red-700">Last confirmed sighting</p>
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
