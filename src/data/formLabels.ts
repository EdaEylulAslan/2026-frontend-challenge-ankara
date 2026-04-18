import type { FormType } from './types'

const FORM_TYPE_LABEL: Record<FormType, string> = {
  checkins: 'Check-ins',
  messages: 'Messages',
  sightings: 'Sightings',
  notes: 'Notes',
  tips: 'Tips',
}

export const getFormTypeLabel = (formType: FormType | 'all'): string => {
  if (formType === 'all') {
    return 'All'
  }

  return FORM_TYPE_LABEL[formType]
}
