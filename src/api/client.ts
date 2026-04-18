const API_BASE_URL = 'https://api.jotform.com'
const RATE_LIMIT_STATUS = 429
const MAX_RETRIES = 2

const apiKeys = [
  import.meta.env.VITE_JOTFORM_API_KEY_1,
  import.meta.env.VITE_JOTFORM_API_KEY_2,
  import.meta.env.VITE_JOTFORM_API_KEY_3,
].filter((value): value is string => Boolean(value))

let currentKeyIndex = 0

const getNextApiKey = (): string => {
  if (apiKeys.length === 0) {
    throw new Error('Missing Jotform API keys in environment variables.')
  }

  const key = apiKeys[currentKeyIndex]
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length
  return key
}

const buildUrl = (path: string, apiKey: string): string => {
  const url = new URL(path, API_BASE_URL)
  url.searchParams.set('apiKey', apiKey)
  return url.toString()
}

export const jotformFetch = async <T>(path: string, attempt = 0): Promise<T> => {
  const apiKey = getNextApiKey()
  const response = await fetch(buildUrl(path, apiKey))

  if (response.status === RATE_LIMIT_STATUS && attempt < MAX_RETRIES) {
    return jotformFetch<T>(path, attempt + 1)
  }

  if (!response.ok) {
    throw new Error(`Jotform request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}
