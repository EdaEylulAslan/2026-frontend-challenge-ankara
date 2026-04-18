import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import RecordCard from '../cards/RecordCard'
import { canonicalizePerson } from '../../data/canonicalize'
import { parseRecordTimestamp } from '../../data/normalize'
import type { FormType, InvestigationRecord } from '../../data/types'

const dotColors: Record<FormType, string> = {
  checkins: 'bg-blue-500',
  messages: 'bg-emerald-500',
  sightings: 'bg-amber-500',
  notes: 'bg-violet-500',
  tips: 'bg-rose-500',
}

interface TimelineItemProps {
  record: InvestigationRecord
  isFirst: boolean
  isLast: boolean
  topConnector: 'solid' | 'dashed'
  bottomConnector: 'solid' | 'dashed'
  isLastSeen: boolean
  showDisappearanceSeparator: boolean
  isMuted: boolean
  isHighlighted: boolean
  evidenceIndex?: number
  staggerDelayMs?: number
}

const getParsedTimestamp = (record: InvestigationRecord): Date | undefined => {
  const value = record.fields.timestamp

  if (typeof value !== 'string') {
    return undefined
  }

  const parsed = parseRecordTimestamp(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

const connectorClass = (style: 'solid' | 'dashed'): string =>
  style === 'dashed'
    ? 'border-l-2 border-dashed border-amber-800/25'
    : 'border-l-2 border-amber-800/30'

const TimelineItem = ({
  record,
  isFirst,
  isLast,
  topConnector,
  bottomConnector,
  isLastSeen,
  showDisappearanceSeparator,
  isMuted,
  isHighlighted,
  evidenceIndex,
  staggerDelayMs = 0,
}: TimelineItemProps) => {
  const navigate = useNavigate()
  const parsed = getParsedTimestamp(record)
  const timeLabel = parsed ? format(parsed, 'HH:mm') : '--:--'
  const dateLabel = parsed ? format(parsed, 'dd MMM') : 'Unknown date'

  return (
    <article
      className="timeline-item-enter grid grid-cols-[88px_36px_minmax(0,1fr)] gap-3"
      style={{ animationDelay: `${staggerDelayMs}ms` }}
    >
      <div className="pt-2 text-right">
        <p className="font-mono text-xl font-semibold leading-none tracking-tight text-amber-900">
          {timeLabel}
        </p>
        <p className="mt-1 font-serif text-xs italic text-slate-500">{dateLabel}</p>
      </div>

      <div className="relative flex justify-center">
        {!isFirst ? (
          <span className={`absolute top-0 h-1/2 w-px ${connectorClass(topConnector)}`} />
        ) : null}
        <span
          className={`z-[1] mt-1.5 h-3.5 w-3.5 rounded-full ring-2 ring-white ${dotColors[record.formType]} shadow-sm`}
        />
        {!isLast ? (
          <span
            className={`absolute bottom-0 top-[20px] w-px ${connectorClass(bottomConnector)}`}
          />
        ) : null}
      </div>

      <div className="min-w-0">
        {isLastSeen ? (
          <div className="mb-2 inline-flex animate-pulse rounded-lg border border-amber-400 bg-gradient-to-r from-amber-100 to-amber-50 px-3 py-1.5 shadow-sm shadow-amber-900/10">
            <p className="font-serif text-xs font-semibold uppercase tracking-wide text-amber-950">
              Last confirmed sighting
            </p>
          </div>
        ) : null}
        <RecordCard
          record={record}
          evidenceIndex={evidenceIndex}
          leftBorderClassName={isLastSeen ? 'border-l-amber-600' : undefined}
          onPersonClick={(name) => {
            const canonical = canonicalizePerson(name)
            if (canonical.length > 0) {
              navigate(`/people/${encodeURIComponent(canonical)}`)
            }
          }}
          className={`${
            isLastSeen ? 'border-l-amber-600 bg-amber-50/50 p-5 shadow-sm' : ''
          } ${isMuted ? 'opacity-80' : ''} ${
            isHighlighted ? 'border border-rose-300 bg-rose-50/50 ring-1 ring-rose-200/60' : ''
          }`}
        />
        {showDisappearanceSeparator ? (
          <div
            className="mt-5 flex items-center gap-3 text-slate-500"
            role="separator"
            aria-label="Cold trail: no further Podo sightings"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-400/70 to-slate-500/90" />
            <span className="max-w-[14rem] text-center font-serif text-xs italic leading-snug text-rose-950/85">
              Cold trail — no Podo signal beyond this line
            </span>
            <span className="font-mono text-lg font-light text-rose-800/70" aria-hidden>
              ×
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-400/70 to-slate-500/90" />
          </div>
        ) : null}
      </div>
    </article>
  )
}

export default TimelineItem
