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

export const GENERATE_EMAIL_FIELDS: FormField[] = [
  {
    name: NAMES.PROMPT,
    label: LABELS.PROMPT,
    placeholder: PLACEHOLDERS.EMAIL_PROMPT,
    type: INPUT_TYPES.TEXTAREA,
  },
]

export const COMPOSE_EMAIL_FIELDS: FormField[] = [
  {
    name: NAMES.SUBJECT,
    label: LABELS.SUBJECT,
    placeholder: PLACEHOLDERS.EMAIL_SUBJECT,
    type: INPUT_TYPES.TEXT,
  },
]


export const MODIFY_SENDER_FIELDS: FormField[] = [
  {
    name: NAMES.DISPLAY_NAME,
    label: LABELS.DISPLAY_NAME,
    placeholder: PLACEHOLDERS.DISPLAY_NAME,
    type: INPUT_TYPES.TEXT,
  },
  {
    name: NAMES.NAME,
    label: LABELS.NAME,
    placeholder: PLACEHOLDERS.NAME,
    type: INPUT_TYPES.TEXT,
  },
  {
    name: NAMES.EMAIL,
    label: LABELS.EMAIL,
    placeholder: PLACEHOLDERS.EMAIL,
    type: INPUT_TYPES.EMAIL,
  },
  {
    name: NAMES.API_KEY,
    label: LABELS.API_KEY,
    placeholder: PLACEHOLDERS.API_KEY,
    type: INPUT_TYPES.TEXT,
  },
  {
    name: NAMES.PRIORITY,
    label: LABELS.PRIORITY,
    placeholder: PLACEHOLDERS.PRIORITY,
    type: INPUT_TYPES.NUMBER,
  },
  {
    name: NAMES.TARGET,
    label: LABELS.TARGET,
    placeholder: PLACEHOLDERS.TARGET,
    type: INPUT_TYPES.NUMBER,
  },
]
