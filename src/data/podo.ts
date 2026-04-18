import { canonicalizePerson } from './canonicalize'
import { parsePeopleList } from './normalize'
import type { InvestigationRecord } from './types'

const PODO = 'podo'

/**
 * Matches Timeline "Podo's Journey" — names on the record that refer to Podo.
 */
export const includesPodo = (record: InvestigationRecord): boolean => {
  const directNames = [
    record.fields.personName,
    record.fields.authorName,
    record.fields.suspectName,
    // Messages form — Podo appears as sender or recipient (see extractRecordPeople in relations.ts)
    record.fields.senderName,
    record.fields.recipientName,
  ].filter((value): value is string => typeof value === 'string')

  const seenWith = parsePeopleList(
    typeof record.fields.seenWith === 'string' ? record.fields.seenWith : undefined,
  )
  const mentionedPeople = parsePeopleList(
    typeof record.fields.mentionedPeople === 'string' ? record.fields.mentionedPeople : undefined,
  )

  return [...directNames, ...seenWith, ...mentionedPeople].some(
    (name) => canonicalizePerson(name) === PODO,
  )
}
