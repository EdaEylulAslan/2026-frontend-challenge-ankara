import { useMemo } from 'react'
import { buildLocationIndex } from '../data/relations'
import { useAllRecords } from './useAllRecords'

export const useLocations = () => {
  const allRecordsQuery = useAllRecords()

  const locations = useMemo(() => {
    const records = allRecordsQuery.data ?? []
    const locationIndex = buildLocationIndex(records)

    return Object.values(locationIndex).sort((a, b) =>
      a.coordinateKey.localeCompare(b.coordinateKey),
    )
  }, [allRecordsQuery.data])

  return {
    ...allRecordsQuery,
    data: locations,
  }
}
