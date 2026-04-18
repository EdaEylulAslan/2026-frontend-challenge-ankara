import { format } from 'date-fns'
import RecordCard from '../cards/RecordCard'
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

const TimelineItem = ({
  record,
  isFirst,
  isLast,
  topConnector,
  bottomConnector,
}: TimelineItemProps) => {
  const parsed = getParsedTimestamp(record)
  const timeLabel = parsed ? format(parsed, 'HH:mm') : '--:--'
  const dateLabel = parsed ? format(parsed, 'dd MMM') : 'Unknown date'

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

      <RecordCard record={record} />
    </article>
  )
}

export default TimelineItem
