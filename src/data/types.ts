export type AnswerPrimitive = string | number | boolean | null
export type AnswerValue = AnswerPrimitive | string[] | Record<string, string>

export interface NormalizedSubmission {
  id: string
  formId: string
  createdAt: string
  fields: Record<string, AnswerValue>
}
