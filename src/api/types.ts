export interface RawAnswer {
  name?: string
  text?: string
  type?: string
  answer?: string | number | boolean | string[] | Record<string, string> | null
}

export interface RawSubmission {
  id: string
  form_id: string
  created_at: string
  answers?: Record<string, RawAnswer>
}

export interface JotformResponse {
  content?: RawSubmission[]
  resultSet?: {
    count?: number
    offset?: number
    limit?: number
  }
  message?: string
  responseCode?: number
}
