import { Link } from 'react-router-dom'
import type { LocationIndexEntry } from '../../data/types'

interface LocationCardProps {
  location: LocationIndexEntry
}

const LocationCard = ({ location }: LocationCardProps) => {
  const title = location.names[0] ?? 'Unnamed location'

  return (
    <Link
      to={`/locations/${encodeURIComponent(location.coordinateKey)}`}
      className="case-card block p-4"
    >
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-xs text-slate-500">{location.coordinateKey}</p>
      <p className="mt-2 text-xs text-slate-600">
        {location.recordIds.length} related records
      </p>
    </Link>
  )
}

export default LocationCard
