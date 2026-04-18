import RecordCard from '../cards/RecordCard'
import type { InvestigationRecord } from '../../data/types'

interface TimelineItemProps {
  record: InvestigationRecord
}

const TimelineItem = ({ record }: TimelineItemProps) => {
  return <RecordCard record={record} />
}

export default TimelineItem
