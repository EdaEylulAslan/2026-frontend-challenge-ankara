import { jotformFetch } from './client'
import type { JotformResponse, RawSubmission } from './types'

const DEFAULT_LIMIT = 1000

export const getSubmissions = async (
  formId: string,
  limit = DEFAULT_LIMIT,
): Promise<RawSubmission[]> => {
  const path = `/form/${formId}/submissions?limit=${limit}`
  const response = await jotformFetch<JotformResponse>(path)

  return response.content ?? []
}
