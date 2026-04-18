import { canonicalizePerson } from './canonicalize'
import { parsePeopleList, parseRecordTimestamp } from './normalize'
import { buildPeopleIndex, extractRecordPeople } from './relations'
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

export interface LastSeenSummary {
  record: InvestigationRecord
  firstCheckInRecord?: InvestigationRecord
  lastSeenWith: string
  lastSeenLocation: string
  lastSeenTimestamp: number
  elapsedFromFirstCheckInMs?: number
}

const toCanonicalFromField = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined
  }

  const canonical = canonicalizePerson(value)
  return canonical.length > 0 ? canonical : undefined
}

const toConfidenceWeight = (value: string): number => {
  const normalized = value.trim().toLowerCase()
  if (normalized === 'high') return 3
  if (normalized === 'medium') return 2
  return 1
}

const formatElapsed = (durationMs: number): string => {
  const totalMinutes = Math.max(0, Math.floor(durationMs / (60 * 1000)))
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${hours}h ${minutes}m`
}

export interface SuspectScoreEntry {
  canonicalName: string
  score: number
  variants: string[]
  reasons: string[]
  topReasons: string[]
}

export const buildLastSeenSummary = (
  records: InvestigationRecord[],
): LastSeenSummary | undefined => {
  const lastSeenRecord = findLastSeenPodoRecord(records)
  if (!lastSeenRecord) {
    return undefined
  }

  const firstCheckInRecord = [...records]
    .filter((record) => record.formType === 'checkins' && includesPodo(record))
    .sort((a, b) => toTimestamp(a) - toTimestamp(b))[0]

  const lastSeenWith =
    typeof lastSeenRecord.fields.seenWith === 'string' ? lastSeenRecord.fields.seenWith : 'Unknown'
  const lastSeenLocation =
    typeof lastSeenRecord.fields.location === 'string'
      ? lastSeenRecord.fields.location
      : 'Unknown location'
  const lastSeenTimestamp = toTimestamp(lastSeenRecord)

  const elapsedFromFirstCheckInMs =
    firstCheckInRecord && lastSeenTimestamp > 0
      ? Math.max(0, lastSeenTimestamp - toTimestamp(firstCheckInRecord))
      : undefined

  return {
    record: lastSeenRecord,
    firstCheckInRecord,
    lastSeenWith,
    lastSeenLocation,
    lastSeenTimestamp,
    elapsedFromFirstCheckInMs,
  }
}

export const buildSuspicionScores = (records: InvestigationRecord[]): SuspectScoreEntry[] => {
  const peopleIndex = buildPeopleIndex(records)
  const summary = buildLastSeenSummary(records)
  const lastSeenTimestamp = summary?.lastSeenTimestamp ?? 0

  const scoreMap: Record<string, SuspectScoreEntry> = {}

  const ensureEntry = (canonicalName: string): SuspectScoreEntry => {
    if (!scoreMap[canonicalName]) {
      scoreMap[canonicalName] = {
        canonicalName,
        score: 0,
        variants: peopleIndex[canonicalName]?.variants ?? [canonicalName],
        reasons: [],
        topReasons: [],
      }
    }
    return scoreMap[canonicalName]
  }

  const addScore = (canonicalName: string, points: number, reason: string): void => {
    if (canonicalName === PODO_NAME) {
      return
    }

    const entry = ensureEntry(canonicalName)
    entry.score += points
    entry.reasons.push(reason)
  }

  for (const record of records) {
    if (record.formType === 'tips') {
      const suspect = toCanonicalFromField(record.fields.suspectName)
      const confidence =
        typeof record.fields.confidence === 'string' ? record.fields.confidence : 'low'

      if (suspect) {
        const points = toConfidenceWeight(confidence)
        addScore(suspect, points, `Anonymous tip (${confidence})`)
      }
    }

    if (
      record.formType === 'sightings' &&
      toTimestamp(record) > lastSeenTimestamp &&
      toCanonicalFromField(record.fields.personName)
    ) {
      const person = toCanonicalFromField(record.fields.personName)
      const seenWith = toCanonicalFromField(record.fields.seenWith)
      if (person && (!seenWith || seenWith === 'unknown')) {
        addScore(person, 2, 'Seen alone after last confirmed sighting')
      }
    }

    if (record.formType === 'messages') {
      const sender = toCanonicalFromField(record.fields.senderName)
      const urgency =
        typeof record.fields.urgency === 'string' ? record.fields.urgency.trim().toLowerCase() : ''
      if (sender && urgency === 'high') {
        addScore(sender, 1, 'Sent high urgency message')
      }
    }

    if (record.formType === 'sightings') {
      const timestamp = toTimestamp(record)
      const lateNightThreshold = summary ? summary.lastSeenTimestamp - 41 * 60 * 1000 : 0
      const person = toCanonicalFromField(record.fields.personName)
      const seenWithCandidates =
        typeof record.fields.seenWith === 'string' ? parsePeopleList(record.fields.seenWith) : []

      if (timestamp >= lateNightThreshold) {
        if (person === PODO_NAME) {
          for (const name of seenWithCandidates) {
            const canonical = canonicalizePerson(name)
            if (canonical && canonical !== PODO_NAME) {
              addScore(canonical, 1, 'With Podo late at night')
            }
          }
        } else if (
          person &&
          seenWithCandidates.some((name) => canonicalizePerson(name) === PODO_NAME)
        ) {
          addScore(person, 1, 'With Podo late at night')
        }
      }
    }
  }

  if (summary && typeof summary.record.fields.seenWith === 'string') {
    const candidates = parsePeopleList(summary.record.fields.seenWith)
    for (const name of candidates) {
      const canonical = canonicalizePerson(name)
      if (canonical && canonical !== PODO_NAME) {
        addScore(canonical, 3, 'Last seen with Podo at final confirmed sighting')
      }
    }
  }

  return Object.values(scoreMap)
    .filter((entry) => entry.score > 0)
    .map((entry) => {
      const frequency: Record<string, number> = {}
      for (const reason of entry.reasons) {
        frequency[reason] = (frequency[reason] ?? 0) + 1
      }

      const topReasons = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([reason]) => reason)

      return {
        ...entry,
        topReasons,
      }
    })
    .sort((a, b) => b.score - a.score)
}

export const formatElapsedFromFirstCheckIn = (
  summary: LastSeenSummary | undefined,
): string | undefined => {
  if (!summary?.elapsedFromFirstCheckInMs) {
    return undefined
  }

  return formatElapsed(summary.elapsedFromFirstCheckInMs)
}
