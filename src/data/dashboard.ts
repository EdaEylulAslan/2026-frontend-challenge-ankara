import { canonicalizePerson } from './canonicalize'
import { parsePeopleList, parseRecordTimestamp } from './normalize'
import { extractRecordPeople } from './relations'
import type { FormType, InvestigationRecord } from './types'

const PODO_NAME = 'podo'

const toTimestamp = (record: InvestigationRecord): number => {
  const timestamp = record.fields.timestamp
  if (typeof timestamp !== 'string') {
    return 0
  }

  const parsed = parseRecordTimestamp(timestamp)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

const includesPodo = (record: InvestigationRecord): boolean => {
  const people = extractRecordPeople(record).map((name) => canonicalizePerson(name))

  if (people.includes(PODO_NAME)) {
    return true
  }

  const mentionedPeople = record.fields.mentionedPeople
  if (typeof mentionedPeople === 'string') {
    return parsePeopleList(mentionedPeople).some(
      (name) => canonicalizePerson(name) === PODO_NAME,
    )
  }

  return false
}

export const findLastSeenPodoRecord = (
  records: InvestigationRecord[],
): InvestigationRecord | undefined => {
  return records
    .filter((record) => includesPodo(record))
    .sort((a, b) => toTimestamp(b) - toTimestamp(a))[0]
}

export interface DashboardStats {
  totalRecords: number
  peopleCount: number
  locationCount: number
  recordsByType: Record<FormType, number>
}

export const buildDashboardStats = (
  records: InvestigationRecord[],
  peopleCount: number,
  locationCount: number,
): DashboardStats => {
  const recordsByType: Record<FormType, number> = {
    checkins: 0,
    messages: 0,
    sightings: 0,
    notes: 0,
    tips: 0,
  }

  for (const record of records) {
    recordsByType[record.formType] += 1
  }

  return {
    totalRecords: records.length,
    peopleCount,
    locationCount,
    recordsByType,
  }
}
