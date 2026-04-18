import type { FormType, InvestigationRecord } from '../data/types'
import { getFormTypeLabel } from '../data/formLabels'

export interface TimelineEmptyCopy {
  message: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  showIllustration?: boolean
}

type Mode = 'journey' | 'all'

interface Params {
  mode: Mode
  formType: FormType | 'all'
  searchTerm: string
  records: InvestigationRecord[]
  podoRecords: InvestigationRecord[]
  filteredCount: number
  setMode: (mode: Mode) => void
}

/**
 * Derives copy when the timeline list is empty (filteredRecords.length === 0).
 */
export const getTimelineEmptyState = ({
  mode,
  formType,
  searchTerm,
  records,
  podoRecords,
  filteredCount,
  setMode,
}: Params): TimelineEmptyCopy | null => {
  if (filteredCount > 0) {
    return null
  }

  const hasSearch = searchTerm.trim().length > 0
  const label = getFormTypeLabel(formType)
  const podoInSelectedForm =
    formType === 'all'
      ? podoRecords.length
      : podoRecords.filter((r) => r.formType === formType).length

  if (mode === 'all' && hasSearch) {
    return {
      message:
        formType === 'all'
          ? 'No records match your search'
          : `No ${label} records match your search`,
      showIllustration: true,
    }
  }

  if (mode === 'journey' && formType !== 'all' && podoInSelectedForm === 0) {
    return {
      message: `No ${label} records directly involve Podo`,
      subtitle: `Try switching to "All Records" to see ${label} entries from suspects, witnesses, and other people.`,
      actionLabel: `View all ${label}`,
      onAction: () => setMode('all'),
      showIllustration: true,
    }
  }

  if (mode === 'journey' && formType !== 'all' && podoInSelectedForm > 0 && hasSearch) {
    return {
      message: `No ${label} records in Podo's journey match your search`,
      subtitle: 'Try clearing the search or switching to All Records for the full dataset.',
      showIllustration: true,
    }
  }

  if (mode === 'journey' && formType === 'all' && hasSearch && podoRecords.length > 0) {
    return {
      message: "No events in Podo's journey match your search",
      subtitle: 'Try clearing the search or viewing All Records.',
      showIllustration: true,
    }
  }

  if (mode === 'journey' && formType === 'all' && podoRecords.length === 0) {
    return {
      message: "No records match — Podo's trail goes cold here 🔍",
      showIllustration: true,
    }
  }

  if (mode === 'all' && formType !== 'all' && !hasSearch) {
    const totalOfForm = records.filter((r) => r.formType === formType).length
    if (totalOfForm === 0) {
      return {
        message: `No ${label} records in this investigation`,
        showIllustration: true,
      }
    }
  }

  return {
    message: 'No records to show with the current filters.',
    showIllustration: true,
  }
}
