import { format } from 'date-fns'
import { MapPin } from 'lucide-react'
import RecordTypeBadge from '../records/RecordTypeBadge'
import SubjectBadge from '../records/SubjectBadge'
import { canonicalizePerson } from '../../data/canonicalize'
import { parsePeopleList, parseRecordTimestamp } from '../../data/normalize'
import type { InvestigationRecord } from '../../data/types'

interface RecordCardProps {
  record: InvestigationRecord
  onPersonClick?: (name: string) => void
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

interface RelationshipMeta {
  segments: Array<{ text: string; clickableName?: string }>
}

const getRelationshipMeta = (record: InvestigationRecord): RelationshipMeta => {
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
    return {
      segments: [
        { text: 'Podo', clickableName: 'Podo' },
        { text: ' with ' },
        { text: seenWith[0], clickableName: seenWith[0] },
      ],
    }
  }

  if (personName && seenWith.some((name) => canonicalizePerson(name) === 'podo')) {
    return {
      segments: [
        { text: personName, clickableName: personName },
        { text: ' with ' },
        { text: 'Podo', clickableName: 'Podo' },
      ],
    }
  }

  if (authorName && mentionedPeople.some((name) => canonicalizePerson(name) === 'podo')) {
    return {
      segments: [
        { text: authorName, clickableName: authorName },
        { text: ' mentioned ' },
        { text: 'Podo', clickableName: 'Podo' },
      ],
    }
  }

  if (senderName) {
    return {
      segments: [
        { text: senderName, clickableName: senderName },
        { text: ' sent a message' },
      ],
    }
  }

  if (personName) {
    return { segments: [{ text: personName, clickableName: personName }] }
  }

  return { segments: [{ text: 'Unknown relation' }] }
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

const RecordCard = ({ record, onPersonClick, className }: RecordCardProps) => {
  const location =
    typeof record.fields.location === 'string' ? record.fields.location : 'Unknown location'
  const relationship = getRelationshipMeta(record)
  const isSubjectRecord = relationship.segments.some(
    (segment) =>
      typeof segment.clickableName === 'string' &&
      canonicalizePerson(segment.clickableName) === 'podo',
  )

  return (
    <article className={`case-card p-4 ${className ?? ''}`}>
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
        <h3 className="text-sm font-semibold text-slate-900">
          {relationship.segments.map((segment, index) => {
            if (segment.clickableName && onPersonClick) {
              return (
                <button
                  key={`${segment.text}-${index}`}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onPersonClick(segment.clickableName as string)
                  }}
                  className="cursor-pointer underline decoration-slate-300 underline-offset-2 transition hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1"
                >
                  {segment.text}
                </button>
              )
            }

            return <span key={`${segment.text}-${index}`}>{segment.text}</span>
          })}
        </h3>
        {isSubjectRecord ? <SubjectBadge /> : null}
      </div>
      <p className="mt-1 text-sm text-slate-700">{getPrimaryText(record)}</p>
    </article>
  )
}

export default RecordCard
