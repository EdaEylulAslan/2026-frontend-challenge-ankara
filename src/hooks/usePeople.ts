import { useMemo } from 'react'
import { buildPeopleIndex } from '../data/relations'
import { useAllRecords } from './useAllRecords'

export const usePeople = () => {
  const allRecordsQuery = useAllRecords()

  const people = useMemo(() => {
    const records = allRecordsQuery.data ?? []
    const peopleIndex = buildPeopleIndex(records)

    return Object.values(peopleIndex).sort((a, b) =>
      a.canonicalName.localeCompare(b.canonicalName),
    )
  }, [allRecordsQuery.data])

  return {
    ...allRecordsQuery,
    data: people,
  }
}
