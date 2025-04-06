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

export const MODIFY_CONTACT_FIELDS: FormField[] = [
  {
    name: NAMES.NAME,
    label: LABELS.CONTACT_NAME,
    placeholder: PLACEHOLDERS.CONTACT_NAME,
    type: INPUT_TYPES.TEXT,
  },
  {
    name: NAMES.POSITION,
    label: LABELS.POSITION,
    placeholder: PLACEHOLDERS.POSITION,
    type: INPUT_TYPES.TEXT,
  },
  {
    name: NAMES.EMAIL,
    label: LABELS.EMAIL,
    placeholder: PLACEHOLDERS.EMAIL,
    type: INPUT_TYPES.EMAIL,
  },
  {
    name: NAMES.PHONE,
    label: LABELS.PHONE,
    placeholder: PLACEHOLDERS.PHONE,
    type: INPUT_TYPES.TEXT,
  },
  {
    name: NAMES.LINKEDIN_URL,
    label: LABELS.LINKEDIN_URL,
    placeholder: PLACEHOLDERS.LINKEDIN_URL,
    type: INPUT_TYPES.TEXT,
  },
  {
    name: NAMES.LOCATION,
    label: LABELS.LOCATION,
    placeholder: PLACEHOLDERS.LOCATION,
    type: INPUT_TYPES.TEXT,
  },
]


export const COMPOSE_EMAIL_FIELDS: FormField[] = [
  // {
  //   name: NAMES.RECIPIENTS,
  //   label: LABELS.TO,
  //   placeholder: PLACEHOLDERS.RECIPIENTS,
  //   type: INPUT_TYPES.TEXT,
  //   readOnly: true,
  // },
  {
    name: NAMES.SUBJECT,
    label: LABELS.SUBJECT,
    placeholder: PLACEHOLDERS.EMAIL_SUBJECT,
    type: INPUT_TYPES.TEXT,
  },
]