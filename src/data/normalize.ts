import { parse } from 'date-fns'
import type { RawSubmission } from '../api/types'
import type { AnswerValue, NormalizedSubmission } from './types'

const SKIPPED_CONTROL_TYPES = new Set(['control_head', 'control_button'])

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

const isStringRecord = (value: unknown): value is Record<string, string> =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  Object.values(value).every((item) => typeof item === 'string')

const normalizeAnswerValue = (value: unknown): AnswerValue | undefined => {
  if (value === null) {
    return null
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value
  }

  if (isStringArray(value)) {
    return value
  }

  if (isStringRecord(value)) {
    return value
  }

  return undefined
}

export const parseRecordTimestamp = (value: string): Date =>
  parse(value, 'dd-MM-yyyy HH:mm', new Date())

export const parsePeopleList = (value: string | undefined): string[] => {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((person) => person.trim())
    .filter((person) => person.length > 0)
}

export const normalizeSubmission = (raw: RawSubmission): NormalizedSubmission => {
  const fields: Record<string, AnswerValue> = {}
  const answers = raw.answers ?? {}

  for (const answer of Object.values(answers)) {
    const name = answer.name?.trim()
    const type = answer.type

    if (!name || !type || SKIPPED_CONTROL_TYPES.has(type)) {
      continue
    }

    const normalizedValue = normalizeAnswerValue(answer.answer)

    if (normalizedValue !== undefined) {
      fields[name] = normalizedValue
    }
  }

  return {
    id: raw.id,
    formId: raw.form_id,
    createdAt: raw.created_at,
    fields,
  }
}
