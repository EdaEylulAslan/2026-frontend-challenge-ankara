import { parseRecordTimestamp } from '../../data/normalize'
import type { InvestigationRecord } from '../../data/types'
import TimelineItem from './TimelineItem'

interface TimelineViewProps {
  records: InvestigationRecord[]
  lastSeenRecordId?: string
  showDisappearanceSeparatorAfterId?: string
  mutedRecordIds?: Set<string>
  highlightedRecordIds?: Set<string>
}

const getTimestamp = (record: InvestigationRecord): number => {
  const timestamp = record.fields.timestamp
  if (typeof timestamp !== 'string') {
    return 0
  }

  const parsed = parseRecordTimestamp(timestamp)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

const DASHED_GAP_MS = 30 * 60 * 1000

const TimelineView = ({
  records,
  lastSeenRecordId,
  showDisappearanceSeparatorAfterId,
  mutedRecordIds,
  highlightedRecordIds,
}: TimelineViewProps) => {
  const sorted = [...records].sort((a, b) => getTimestamp(a) - getTimestamp(b))

  return (
    <div className="space-y-3">
      {sorted.map((record, index) => (
        <TimelineItem
          key={`${record.formType}-${record.id}`}
          record={record}
          isFirst={index === 0}
          isLast={index === sorted.length - 1}
          topConnector={
            index > 0 && getTimestamp(record) - getTimestamp(sorted[index - 1]) > DASHED_GAP_MS
              ? 'dashed'
              : 'solid'
          }
          bottomConnector={
            index < sorted.length - 1 &&
            getTimestamp(sorted[index + 1]) - getTimestamp(record) > DASHED_GAP_MS
              ? 'dashed'
              : 'solid'
          }
          isLastSeen={record.id === lastSeenRecordId}
          showDisappearanceSeparator={record.id === showDisappearanceSeparatorAfterId}
          isMuted={mutedRecordIds?.has(record.id) ?? false}
          isHighlighted={highlightedRecordIds?.has(record.id) ?? false}
        />
      ))}
    </div>
  )
}

export default TimelineView
