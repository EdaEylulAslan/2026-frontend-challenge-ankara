const TURKISH_CHAR_MAP: Record<string, string> = {
  ğ: 'g',
  ü: 'u',
  ş: 's',
  ı: 'i',
  ö: 'o',
  ç: 'c',
}

const NON_PERSON_PLACEHOLDERS = new Set(['unknown', 'event staff', ''])

const replaceTurkishChars = (value: string): string =>
  value
    .split('')
    .map((char) => TURKISH_CHAR_MAP[char] ?? char)
    .join('')

export const canonicalizePerson = (name: string): string => {
  const normalized = replaceTurkishChars(name.trim().toLowerCase())
    .replace(/\s+[a-z]\.$/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  return normalized
}

export const isPersonPlaceholder = (name: string): boolean =>
  NON_PERSON_PLACEHOLDERS.has(canonicalizePerson(name))
