import { Link } from 'react-router-dom'
import type { LocationIndexEntry } from '../../data/types'

interface LocationCardProps {
  location: LocationIndexEntry
  hasPodoSightings?: boolean
  isLastSeenLocation?: boolean
}

const LocationCard = ({
  location,
  hasPodoSightings = false,
  isLastSeenLocation = false,
}: LocationCardProps) => {
  const title = location.names[0] ?? 'Unnamed location'

  return (
    <Link
      to={`/locations/${encodeURIComponent(location.coordinateKey)}`}
      className={`case-card relative block overflow-hidden p-4 transition-transform hover:-translate-y-0.5 ${
        hasPodoSightings || isLastSeenLocation
          ? 'border-amber-400/80 bg-amber-50/40 ring-1 ring-amber-300/40'
          : ''
      }`}
    >
      {isLastSeenLocation ? (
        <span className="absolute right-2 top-2 rounded border border-amber-700/30 bg-amber-100/95 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-950">
          Last seen
        </span>
      ) : null}
      <h3 className="pr-24 font-serif text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 font-mono text-[11px] leading-snug text-slate-600">{location.coordinateKey}</p>
      <p className="mt-2 text-xs text-slate-600">
        {location.recordIds.length} related record{location.recordIds.length === 1 ? '' : 's'}
      </p>
      {hasPodoSightings ? (
        <p className="mt-2 font-mono text-[10px] font-medium uppercase tracking-wide text-amber-900">
          Podo activity on file
        </p>
      ) : null}
    </Link>
  )
}

export default LocationCard
