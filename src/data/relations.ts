import { canonicalizePerson, isPersonPlaceholder } from './canonicalize'
import { parsePeopleList } from './normalize'
import type {
  LocationIndexEntry,
  NormalizedSubmission,
  PersonIndexEntry,
} from './types'

const PERSON_FIELD_KEYS = [
  'personName',
  'senderName',
  'recipientName',
  'authorName',
  'suspectName',
]

const LOCATION_NAME_FIELD = 'location'
const LOCATION_COORDINATE_FIELD = 'coordinates'

const toStringValue = (value: unknown): string | undefined => {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }

  return undefined
}

export const extractRecordPeople = (record: NormalizedSubmission): string[] => {
  const basePeople = PERSON_FIELD_KEYS.map((key) => toStringValue(record.fields[key])).filter(
    (value): value is string => Boolean(value),
  )

  const seenWith = parsePeopleList(toStringValue(record.fields.seenWith))
  const mentionedPeople = parsePeopleList(toStringValue(record.fields.mentionedPeople))

  return [...basePeople, ...seenWith, ...mentionedPeople]
}

export const buildPeopleIndex = (
  records: NormalizedSubmission[],
): Record<string, PersonIndexEntry> => {
  const index: Record<string, PersonIndexEntry> = {}

  for (const record of records) {
    const people = extractRecordPeople(record)

    for (const person of people) {
      if (isPersonPlaceholder(person)) {
        continue
      }

      const canonicalName = canonicalizePerson(person)

      if (!canonicalName) {
        continue
      }

      if (!index[canonicalName]) {
        index[canonicalName] = {
          canonicalName,
          variants: [],
          recordIds: [],
        }
      }

      const entry = index[canonicalName]

      if (!entry.variants.includes(person)) {
        entry.variants.push(person)
      }

      if (!entry.recordIds.includes(record.id)) {
        entry.recordIds.push(record.id)
      }
    }
  }

  return index
}

export const buildLocationIndex = (
  records: NormalizedSubmission[],
): Record<string, LocationIndexEntry> => {
  const index: Record<string, LocationIndexEntry> = {}

  for (const record of records) {
    const coordinateKey = toStringValue(record.fields[LOCATION_COORDINATE_FIELD])

    if (!coordinateKey) {
      continue
    }

    if (!index[coordinateKey]) {
      index[coordinateKey] = {
        coordinateKey,
        names: [],
        recordIds: [],
      }
    }

    const locationName = toStringValue(record.fields[LOCATION_NAME_FIELD])
    const entry = index[coordinateKey]

    if (locationName && !entry.names.includes(locationName)) {
      entry.names.push(locationName)
    }

    if (!entry.recordIds.includes(record.id)) {
      entry.recordIds.push(record.id)
    }
  }

  return index
}

export const findRelatedRecords = (
  records: NormalizedSubmission[],
  targetRecordId: string,
): NormalizedSubmission[] => {
  const target = records.find((record) => record.id === targetRecordId)

  if (!target) {
    return []
  }

  const peopleIndex = buildPeopleIndex(records)
  const targetPeople = extractRecordPeople(target)
    .filter((person) => !isPersonPlaceholder(person))
    .map((person) => canonicalizePerson(person))
    .filter((person) => person.length > 0)

  const relatedIds = new Set<string>()

  for (const person of targetPeople) {
    const entry = peopleIndex[person]

    if (!entry) {
      continue
    }

    for (const recordId of entry.recordIds) {
      if (recordId !== targetRecordId) {
        relatedIds.add(recordId)
      }
    }
  }

  return records.filter((record) => relatedIds.has(record.id))
}
