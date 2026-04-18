import { includesPodo } from './podo'
import { parseRecordTimestamp } from './normalize'
import type { InvestigationRecord } from './types'
import { parseCoordinateKey } from '../utils/coordinates'

const toTimestamp = (record: InvestigationRecord): number => {
  if (typeof record.fields.timestamp !== 'string') {
    return 0
  }

  const parsed = parseRecordTimestamp(record.fields.timestamp)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

export interface JourneyMapPoint {
  record: InvestigationRecord
  position: [number, number]
  /** 1-based stop number along the chronological route */
  order: number
}

/**
 * Podo journey points that include coordinates, oldest → newest (matches timeline order).
 */
export const buildPodosJourneyPoints = (records: InvestigationRecord[]): JourneyMapPoint[] => {
  const withCoords = records
    .filter(includesPodo)
    .map((record) => {
      const raw =
        typeof record.fields.coordinates === 'string' ? record.fields.coordinates : undefined
      const position = raw ? parseCoordinateKey(raw) : undefined
      return position ? { record, position } : null
    })
    .filter((item): item is { record: InvestigationRecord; position: [number, number] } => item !== null)
    .sort((a, b) => toTimestamp(a.record) - toTimestamp(b.record))

  return withCoords.map((item, index) => ({
    ...item,
    order: index + 1,
  }))
}
