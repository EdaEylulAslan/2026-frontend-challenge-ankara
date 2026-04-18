import { format } from 'date-fns'
import RecordTypeBadge from '../records/RecordTypeBadge'
import SubjectBadge from '../records/SubjectBadge'
import { canonicalizePerson } from '../../data/canonicalize'
import { parseRecordTimestamp } from '../../data/normalize'
import type { InvestigationRecord } from '../../data/types'

interface RecordCardProps {
  record: InvestigationRecord
}

const getPrimaryText = (record: InvestigationRecord): string => {
  const candidates = ['note', 'text', 'tip', 'location']

  for (const key of candidates) {
    const value = record.fields[key]
    if (typeof value === 'string' && value.trim()) {
      return value
    }
  }

  return 'No additional details.'
}

const getDisplayTime = (record: InvestigationRecord): string => {
  const timestamp = record.fields.timestamp
  if (typeof timestamp !== 'string') {
    return record.createdAt
  }

  const parsed = parseRecordTimestamp(timestamp)
  if (Number.isNaN(parsed.getTime())) {
    return timestamp
  }

  return format(parsed, 'dd MMM yyyy, HH:mm')
}

const RecordCard = ({ record }: RecordCardProps) => {
  const location =
    typeof record.fields.location === 'string' ? record.fields.location : 'Unknown location'
  const person =
    typeof record.fields.personName === 'string'
      ? record.fields.personName
      : typeof record.fields.senderName === 'string'
        ? record.fields.senderName
        : 'Unknown person'
  const isSubjectRecord = canonicalizePerson(person) === 'podo'

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <RecordTypeBadge formType={record.formType} />
        <span className="text-xs text-slate-500">{getDisplayTime(record)}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{person}</h3>
        {isSubjectRecord ? <SubjectBadge /> : null}
      </div>
      <p className="mt-1 text-sm text-slate-700">{getPrimaryText(record)}</p>
      <p className="mt-2 text-xs text-slate-500">{location}</p>
    </article>
  )
}

export default RecordCard
