import { Link } from 'react-router-dom'
import type { PersonIndexEntry } from '../../data/types'

interface PersonCardProps {
  person: PersonIndexEntry
}

const getInitial = (name: string): string => name.charAt(0).toUpperCase()

const PersonCard = ({ person }: PersonCardProps) => {
  const aliases = person.variants.filter((variant) => variant !== person.canonicalName)

  return (
    <Link
      to={`/people/${encodeURIComponent(person.canonicalName)}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          {getInitial(person.canonicalName)}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold capitalize text-slate-900">
            {person.canonicalName}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {person.recordIds.length} related records
          </p>
          {aliases.length > 0 ? (
            <p className="mt-2 text-xs text-slate-500">
              Also known as: {aliases.join(', ')}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

export default PersonCard
