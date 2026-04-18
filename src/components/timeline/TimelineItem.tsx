import { format } from 'date-fns'
import RecordCard from '../cards/RecordCard'
import { parseRecordTimestamp } from '../../data/normalize'
import type { InvestigationRecord } from '../../data/types'

interface TimelineItemProps {
  record: InvestigationRecord
  isFirst: boolean
  isLast: boolean
}

const getParsedTimestamp = (record: InvestigationRecord): Date | undefined => {
  const value = record.fields.timestamp

  if (typeof value !== 'string') {
    return undefined
  }

  const parsed = parseRecordTimestamp(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

const TimelineItem = ({ record, isFirst, isLast }: TimelineItemProps) => {
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
        {!isFirst ? <span className="absolute top-0 h-1/2 w-px bg-slate-300" /> : null}
        <span className="mt-2 h-3 w-3 rounded-full bg-slate-500" />
        {!isLast ? (
          <span className="absolute bottom-0 top-[18px] w-px border-l border-slate-300" />
        ) : null}
      </div>

      <RecordCard record={record} />
    </article>
  )
}

export default TimelineItem
