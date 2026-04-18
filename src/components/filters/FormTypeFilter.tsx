import { getFormTypeLabel } from '../../data/formLabels'
import type { FormType } from '../../data/types'

interface FormTypeFilterProps {
  value: FormType | 'all'
  onChange: (value: FormType | 'all') => void
}

const FORM_TYPE_VALUES: Array<FormType | 'all'> = [
  'all',
  'checkins',
  'messages',
  'sightings',
  'notes',
  'tips',
]

const options: Array<{ value: FormType | 'all'; label: string }> = FORM_TYPE_VALUES.map((value) => ({
  value,
  label: getFormTypeLabel(value),
}))

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
