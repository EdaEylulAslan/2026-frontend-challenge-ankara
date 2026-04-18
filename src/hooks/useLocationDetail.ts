import { useMemo } from 'react'
import { useAllRecords } from './useAllRecords'

export const useLocationDetail = (coordinateKey: string | undefined) => {
  const allRecordsQuery = useAllRecords()

  const locationDetail = useMemo(() => {
    if (!coordinateKey) {
      return undefined
    }

    const records = allRecordsQuery.data ?? []
    const locationRecords = records.filter(
      (record) => record.fields.coordinates === coordinateKey,
    )

    if (locationRecords.length === 0) {
      return undefined
    }

    const names = Array.from(
      new Set(
        locationRecords
          .map((record) => record.fields.location)
          .filter((value): value is string => typeof value === 'string' && value.length > 0),
      ),
    )

    return {
      coordinateKey,
      names,
      records: locationRecords,
    }
  }, [allRecordsQuery.data, coordinateKey])

  return {
    ...allRecordsQuery,
    data: locationDetail,
  }
}
