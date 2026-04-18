import { Link } from 'react-router-dom'
import type { PersonIndexEntry } from '../../data/types'

interface PersonCardProps {
  person: PersonIndexEntry
  suspicionLevel?: 'high' | 'medium' | 'low' | 'none'
}

const suspicionRingClass: Record<NonNullable<PersonCardProps['suspicionLevel']>, string> = {
  high: 'ring-4 ring-rose-500/50 ring-offset-2 ring-offset-[#fffdf8]',
  medium: 'ring-2 ring-amber-500/55 ring-offset-2 ring-offset-[#fffdf8]',
  low: 'ring-1 ring-slate-400/60 ring-offset-1 ring-offset-[#fffdf8]',
  none: '',
}

const getInitial = (name: string): string => name.charAt(0).toUpperCase()

const PersonCard = ({ person, suspicionLevel = 'none' }: PersonCardProps) => {
  const aliases = person.variants.filter((variant) => variant !== person.canonicalName)

  return (
    <Link
      to={`/people/${encodeURIComponent(person.canonicalName)}`}
      className="case-card block p-4 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white ${suspicionRingClass[suspicionLevel]}`}
        >
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
