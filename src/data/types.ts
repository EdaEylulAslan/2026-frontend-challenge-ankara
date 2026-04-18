export type AnswerPrimitive = string | number | boolean | null
export type AnswerValue = AnswerPrimitive | string[] | Record<string, string>

export interface NormalizedSubmission {
  id: string
  formId: string
  createdAt: string
  fields: Record<string, AnswerValue>
}

export type FormType = 'checkins' | 'messages' | 'sightings' | 'notes' | 'tips'

export interface InvestigationRecord extends NormalizedSubmission {
  formType: FormType
}

export interface PersonIndexEntry {
  canonicalName: string
  variants: string[]
  recordIds: string[]
}

export interface LocationIndexEntry {
  coordinateKey: string
  names: string[]
  recordIds: string[]
}
