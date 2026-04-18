import { useMemo, useState } from 'react'
import FormTypeFilter from '../components/filters/FormTypeFilter'
import SearchBar from '../components/filters/SearchBar'
import EmptyState from '../components/states/EmptyState'
import ErrorState from '../components/states/ErrorState'
import LoadingState from '../components/states/LoadingState'
import { canonicalizePerson } from '../data/canonicalize'
import { parsePeopleList, parseRecordTimestamp } from '../data/normalize'
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

const includesPodo = (record: InvestigationRecord): boolean => {
  const directNames = [
    record.fields.personName,
    record.fields.authorName,
    record.fields.suspectName,
  ].filter((value): value is string => typeof value === 'string')

  const seenWith = parsePeopleList(
    typeof record.fields.seenWith === 'string' ? record.fields.seenWith : undefined,
  )
  const mentionedPeople = parsePeopleList(
    typeof record.fields.mentionedPeople === 'string' ? record.fields.mentionedPeople : undefined,
  )

  return [...directNames, ...seenWith, ...mentionedPeople].some(
    (name) => canonicalizePerson(name) === 'podo',
  )
}

type TimelineMode = 'journey' | 'all'

const toTimestamp = (record: InvestigationRecord): number => {
  if (typeof record.fields.timestamp !== 'string') {
    return 0
  }

  const parsed = parseRecordTimestamp(record.fields.timestamp)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

const isSuspiciousAfterDisappearance = (
  record: InvestigationRecord,
  cutoff: number,
): boolean => {
  if (toTimestamp(record) <= cutoff) {
    return false
  }

  const personName =
    typeof record.fields.personName === 'string' ? canonicalizePerson(record.fields.personName) : ''
  const seenWith =
    typeof record.fields.seenWith === 'string' ? canonicalizePerson(record.fields.seenWith) : ''
  const suspectName =
    typeof record.fields.suspectName === 'string'
      ? canonicalizePerson(record.fields.suspectName)
      : ''

  const isKaganSoloSighting =
    record.formType === 'sightings' && personName === 'kagan' && (seenWith === 'unknown' || !seenWith)
  const isKaganTip = record.formType === 'tips' && suspectName === 'kagan'

  return isKaganSoloSighting || isKaganTip
}

const TimelinePage = () => {
  const { data, isLoading, isError, error, refetch } = useAllRecords()
  const [searchTerm, setSearchTerm] = useState('')
  const [formType, setFormType] = useState<FormType | 'all'>('all')
  const [mode, setMode] = useState<TimelineMode>('journey')

  const records = data ?? []
  const podoRecords = useMemo(() => records.filter(includesPodo), [records])
  const lastSeenRecord = useMemo(
    () =>
      [...podoRecords].sort((a, b) => toTimestamp(b) - toTimestamp(a))[0],
    [podoRecords],
  )
  const filteredRecords = useMemo(() => {
    const sourceRecords = mode === 'journey' ? podoRecords : records
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return sourceRecords.filter((record) => {
      const matchesForm = formType === 'all' || record.formType === formType
      const matchesSearch =
        normalizedSearch.length === 0 || toSearchableText(record).includes(normalizedSearch)

      return matchesForm && matchesSearch
    })
  }, [formType, mode, podoRecords, records, searchTerm])

  const preDisappearanceRecords = useMemo(() => {
    if (mode !== 'all' || !lastSeenRecord) {
      return filteredRecords
    }

    const cutoff = toTimestamp(lastSeenRecord)
    return filteredRecords.filter((record) => toTimestamp(record) <= cutoff)
  }, [filteredRecords, lastSeenRecord, mode])

  const postDisappearanceRecords = useMemo(() => {
    if (mode !== 'all' || !lastSeenRecord) {
      return []
    }

    const cutoff = toTimestamp(lastSeenRecord)
    return filteredRecords.filter(
      (record) => toTimestamp(record) > cutoff && !includesPodo(record),
    )
  }, [filteredRecords, lastSeenRecord, mode])
  const highlightedSuspiciousIds = useMemo(() => {
    if (mode !== 'all' || !lastSeenRecord) {
      return new Set<string>()
    }

    const cutoff = toTimestamp(lastSeenRecord)
    return new Set(
      postDisappearanceRecords
        .filter((record) => isSuspiciousAfterDisappearance(record, cutoff))
        .map((record) => record.id),
    )
  }, [lastSeenRecord, mode, postDisappearanceRecords])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-serif text-2xl font-semibold text-slate-900">Timeline</h2>
      <p className="mt-2 text-sm text-slate-600">
        Chronological view of all submitted records across forms.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode('journey')}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            mode === 'journey'
              ? 'border-amber-600 bg-amber-600 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
          }`}
        >
          Podo&apos;s Journey ({podoRecords.length} events)
        </button>
        <button
          type="button"
          onClick={() => setMode('all')}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            mode === 'all'
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
          }`}
        >
          All Records ({records.length} total)
        </button>
      </div>

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
          <>
            <TimelineView
              records={preDisappearanceRecords}
              lastSeenRecordId={lastSeenRecord?.id}
              showDisappearanceSeparatorAfterId={lastSeenRecord?.id}
            />
            {mode === 'all' && postDisappearanceRecords.length > 0 ? (
              <section className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-800">
                  🕵️ Activity after Podo&apos;s disappearance
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Events reported after the last confirmed sighting.
                </p>
                <div className="mt-3">
                  <TimelineView
                    records={postDisappearanceRecords}
                    mutedRecordIds={new Set(postDisappearanceRecords.map((record) => record.id))}
                    highlightedRecordIds={highlightedSuspiciousIds}
                  />
                </div>
              </section>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  )
}

export default TimelinePage
