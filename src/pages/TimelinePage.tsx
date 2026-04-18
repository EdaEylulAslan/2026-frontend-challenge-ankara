import { useMemo, useState } from 'react'
import FormTypeFilter from '../components/filters/FormTypeFilter'
import SearchBar from '../components/filters/SearchBar'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import TimelineView from '../components/timeline/TimelineView'
import type { FormType, InvestigationRecord } from '../data/types'
import { useAllRecords } from '../hooks/useAllRecords'

const toSearchableText = (record: InvestigationRecord): string => {
  const values = Object.values(record.fields).flatMap((value) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return [String(value)]
    }

    if (Array.isArray(value)) {
      return value.map((item) => String(item))
    }

    if (value && typeof value === 'object') {
      return Object.values(value).map((item) => String(item))
    }

    return []
  })

  return values.join(' ').toLowerCase()
}

const TimelinePage = () => {
  const { data, isLoading, isError, error, refetch } = useAllRecords()
  const [searchTerm, setSearchTerm] = useState('')
  const [formType, setFormType] = useState<FormType | 'all'>('all')

  const records = data ?? []
  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return records.filter((record) => {
      const matchesForm = formType === 'all' || record.formType === formType
      const matchesSearch =
        normalizedSearch.length === 0 || toSearchableText(record).includes(normalizedSearch)

      return matchesForm && matchesSearch
    })
  }, [formType, records, searchTerm])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold text-slate-900">Timeline</h2>
      <p className="mt-2 text-sm text-slate-600">
        Chronological view of all submitted records across forms.
      </p>

      <div className="mt-4 space-y-3">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <FormTypeFilter value={formType} onChange={setFormType} />
      </div>

      <div className="mt-4">
        {isLoading ? <LoadingState /> : null}
        {isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => void refetch()}
          />
        ) : null}
        {!isLoading && !isError && filteredRecords.length === 0 ? (
          <EmptyState message="No records match your filters." />
        ) : null}
        {!isLoading && !isError && filteredRecords.length > 0 ? (
          <TimelineView records={filteredRecords} />
        ) : null}
      </div>
    </section>
  )
}

export default TimelinePage
