import { format } from 'date-fns'
import { MapPin } from 'lucide-react'
import RecordTypeBadge from '../records/RecordTypeBadge'
import SubjectBadge from '../records/SubjectBadge'
import { canonicalizePerson } from '../../data/canonicalize'
import { parsePeopleList, parseRecordTimestamp } from '../../data/normalize'
import type { InvestigationRecord } from '../../data/types'

interface RecordCardProps {
  record: InvestigationRecord
  onClick?: () => void
  className?: string
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

const getRelationshipText = (record: InvestigationRecord): string => {
  const personName =
    typeof record.fields.personName === 'string' ? record.fields.personName : undefined
  const senderName =
    typeof record.fields.senderName === 'string' ? record.fields.senderName : undefined
  const authorName =
    typeof record.fields.authorName === 'string' ? record.fields.authorName : undefined
  const seenWith =
    typeof record.fields.seenWith === 'string' ? parsePeopleList(record.fields.seenWith) : []
  const mentionedPeople =
    typeof record.fields.mentionedPeople === 'string'
      ? parsePeopleList(record.fields.mentionedPeople)
      : []

  if (personName && canonicalizePerson(personName) === 'podo' && seenWith[0]) {
    return `Podo with ${seenWith[0]}`
  }

  if (personName && seenWith.some((name) => canonicalizePerson(name) === 'podo')) {
    return `${personName} with Podo`
  }

  if (authorName && mentionedPeople.some((name) => canonicalizePerson(name) === 'podo')) {
    return `${authorName} mentioned Podo`
  }

  if (senderName) {
    return `${senderName} sent a message`
  }

  if (personName) {
    return personName
  }

  return 'Unknown relation'
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

const RecordCard = ({ record, onClick, className }: RecordCardProps) => {
  const location =
    typeof record.fields.location === 'string' ? record.fields.location : 'Unknown location'
  const relationshipText = getRelationshipText(record)
  const isSubjectRecord = canonicalizePerson(relationshipText).includes('podo')

  return (
    <article
      onClick={onClick}
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className ?? ''}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <RecordTypeBadge formType={record.formType} />
          <span className="inline-flex items-center gap-1 text-xs text-slate-600">
            <MapPin size={12} />
            {location}
          </span>
        </div>
        <span className="text-xs text-slate-500">{getDisplayTime(record)}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-slate-900">{relationshipText}</h3>
        {isSubjectRecord ? <SubjectBadge /> : null}
      </div>
      <p className="mt-1 text-sm text-slate-700">{getPrimaryText(record)}</p>
    </article>
  )
}

export default RecordCard
