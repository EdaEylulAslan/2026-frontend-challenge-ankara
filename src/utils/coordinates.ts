/**
 * Parses Jotform coordinate strings (e.g. "39.94, 32.86") into [lat, lng].
 */
export const parseCoordinateKey = (key: string): [number, number] | undefined => {
  const parts = key.split(',').map((segment) => segment.trim())
  if (parts.length !== 2) {
    return undefined
  }

  const lat = Number(parts[0])
  const lng = Number(parts[1])

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return undefined
  }

  return [lat, lng]
}
