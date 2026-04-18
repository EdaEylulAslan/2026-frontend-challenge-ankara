import type { FormType } from '../../data/types'

const badgeStyles: Record<FormType, string> = {
  checkins: 'bg-blue-100 text-blue-700',
  messages: 'bg-emerald-100 text-emerald-700',
  sightings: 'bg-amber-100 text-amber-700',
  notes: 'bg-violet-100 text-violet-700',
  tips: 'bg-rose-100 text-rose-700',
}

const labels: Record<FormType, string> = {
  checkins: 'Check-ins',
  messages: 'Messages',
  sightings: 'Sightings',
  notes: 'Personal Notes',
  tips: 'Anonymous Tips',
}

interface RecordTypeBadgeProps {
  formType: FormType
}

const RecordTypeBadge = ({ formType }: RecordTypeBadgeProps) => {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${badgeStyles[formType]}`}
    >
      {labels[formType]}
    </span>
  )
}

export default RecordTypeBadge
