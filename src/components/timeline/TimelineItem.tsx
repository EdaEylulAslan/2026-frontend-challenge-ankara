import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import RecordCard from '../cards/RecordCard'
import { canonicalizePerson } from '../../data/canonicalize'
import { parseRecordTimestamp } from '../../data/normalize'
import { parsePeopleList } from '../../data/normalize'
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
  style === 'dashed' ? 'border-l border-dashed border-slate-300' : 'border-l border-slate-300'

const getNavigationTarget = (record: InvestigationRecord): string | undefined => {
  const directCandidates = [
    record.fields.personName,
    record.fields.senderName,
    record.fields.suspectName,
  ].filter((value): value is string => typeof value === 'string' && value.trim().length > 0)

  const seenWithCandidates = parsePeopleList(
    typeof record.fields.seenWith === 'string' ? record.fields.seenWith : undefined,
  )

  const candidate = [...directCandidates, ...seenWithCandidates][0]
  if (!candidate) {
    return undefined
  }

  const canonical = canonicalizePerson(candidate)
  return canonical.length > 0 ? canonical : undefined
}

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
}: TimelineItemProps) => {
  const navigate = useNavigate()
  const parsed = getParsedTimestamp(record)
  const timeLabel = parsed ? format(parsed, 'HH:mm') : '--:--'
  const dateLabel = parsed ? format(parsed, 'dd MMM') : 'Unknown date'
  const navigationTarget = getNavigationTarget(record)

  return (
    <article className="grid grid-cols-[84px_32px_minmax(0,1fr)] gap-3">
      <div className="pt-2 text-right">
        <p className="text-xl font-semibold leading-none text-slate-500">{timeLabel}</p>
        <p className="mt-1 text-xs text-slate-400">{dateLabel}</p>
      </div>

      <div className="relative flex justify-center">
        {!isFirst ? (
          <span className={`absolute top-0 h-1/2 w-px ${connectorClass(topConnector)}`} />
        ) : null}
        <span className={`mt-2 h-3 w-3 rounded-full ${dotColors[record.formType]}`} />
        {!isLast ? (
          <span
            className={`absolute bottom-0 top-[18px] w-px ${connectorClass(bottomConnector)}`}
          />
        ) : null}
      </div>

      <div className="min-w-0">
        {isLastSeen ? (
          <p className="mb-2 inline-flex rounded-full border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
            ⚠️ LAST CONFIRMED SIGHTING
          </p>
        ) : null}
        <RecordCard
          record={record}
          onClick={() => {
            if (navigationTarget) {
              navigate(`/people/${encodeURIComponent(navigationTarget)}`)
            }
          }}
          className={`${navigationTarget ? 'cursor-pointer transition hover:shadow-md' : ''} ${
            isLastSeen ? 'border-l-4 border-l-amber-500 bg-amber-50/40 p-5' : ''
          } ${isMuted ? 'opacity-80' : ''} ${
            isHighlighted ? 'border border-rose-200 bg-rose-50/40' : ''
          }`}
        />
        {showDisappearanceSeparator ? (
          <p className="mt-3 text-center text-xs text-slate-500">
            —— Podo disappears after this point ——
          </p>
        ) : null}
      </div>
    </article>
  )
}

export default TimelineItem
