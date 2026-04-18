import { useQuery } from '@tanstack/react-query'
import { getSubmissions } from '../api/jotform'
import { normalizeSubmission } from '../data/normalize'
import type { FormType, InvestigationRecord } from '../data/types'

interface FormConfig {
  formType: FormType
  formId: string | undefined
}

const FORM_CONFIGS: FormConfig[] = [
  { formType: 'checkins', formId: import.meta.env.VITE_FORM_CHECKINS },
  { formType: 'messages', formId: import.meta.env.VITE_FORM_MESSAGES },
  { formType: 'sightings', formId: import.meta.env.VITE_FORM_SIGHTINGS },
  { formType: 'notes', formId: import.meta.env.VITE_FORM_NOTES },
  { formType: 'tips', formId: import.meta.env.VITE_FORM_TIPS },
]

const fetchAllRecords = async (): Promise<InvestigationRecord[]> => {
  const invalidForm = FORM_CONFIGS.find((item) => !item.formId)

  if (invalidForm) {
    throw new Error(`Missing environment variable for form type: ${invalidForm.formType}`)
  }

  const recordsPerForm = await Promise.all(
    FORM_CONFIGS.map(async ({ formType, formId }) => {
      const submissions = await getSubmissions(formId as string)

      return submissions.map((submission) => ({
        ...normalizeSubmission(submission),
        formType,
      }))
    }),
  )

  return recordsPerForm.flat()
}

export const useAllRecords = () =>
  useQuery({
    queryKey: ['all-records'],
    queryFn: fetchAllRecords,
  })
