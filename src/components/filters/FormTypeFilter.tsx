import type { FormType } from '../../data/types'

interface FormTypeFilterProps {
  value: FormType | 'all'
  onChange: (value: FormType | 'all') => void
}

const options: Array<{ value: FormType | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'checkins', label: 'Check-ins' },
  { value: 'messages', label: 'Messages' },
  { value: 'sightings', label: 'Sightings' },
  { value: 'notes', label: 'Notes' },
  { value: 'tips', label: 'Tips' },
]

const FormTypeFilter = ({ value, onChange }: FormTypeFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            value === option.value
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default FormTypeFilter
