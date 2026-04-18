import { useMemo } from 'react'
import { canonicalizePerson } from '../data/canonicalize'
import { buildPeopleIndex } from '../data/relations'
import { useAllRecords } from './useAllRecords'

export const usePersonDetail = (rawName: string | undefined) => {
  const allRecordsQuery = useAllRecords()

  const personDetail = useMemo(() => {
    if (!rawName) {
      return undefined
    }

    const canonicalName = canonicalizePerson(rawName)
    const records = allRecordsQuery.data ?? []
    const peopleIndex = buildPeopleIndex(records)
    const person = peopleIndex[canonicalName]

    if (!person) {
      return undefined
    }

    const personRecords = records.filter((record) => person.recordIds.includes(record.id))

    return {
      person,
      records: personRecords,
    }
  }, [allRecordsQuery.data, rawName])

  return {
    ...allRecordsQuery,
    data: personDetail,
  }
}
