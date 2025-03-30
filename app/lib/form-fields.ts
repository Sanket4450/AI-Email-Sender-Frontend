import { INPUT_TYPES } from './constants'
import { LABELS, NAMES, PLACEHOLDERS } from './form'

interface FormField {
  name: string
  label: string
  placeholder: string
  type?: string
  readOnly?: boolean
}

export const MODIFY_COMPANY_FIELDS: FormField[] = [
  {
    name: NAMES.TITLE,
    label: LABELS.COMPANY_NAME,
    placeholder: PLACEHOLDERS.COMPANY_NAME,
    type: INPUT_TYPES.TEXT,
  },
  {
    name: NAMES.DESCRIPTION,
    label: LABELS.COMPANY_DESCRIPTION,
    placeholder: PLACEHOLDERS.COMPANY_DESCRIPTION,
    type: INPUT_TYPES.TEXTAREA,
  },
  {
    name: NAMES.LOCATION,
    label: LABELS.COMPANY_LOCATION,
    placeholder: PLACEHOLDERS.COMPANY_LOCATION,
    type: INPUT_TYPES.TEXT,
  },
]
