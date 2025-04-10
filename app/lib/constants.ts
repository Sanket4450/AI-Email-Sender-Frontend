import { ESP } from '~/types/sender'

export const CONSTANTS = {
  // General
  APP_NAME: 'AI Email Sender',
  APP_DESCRIPTION: 'A personalized email sender with AI for better reach.',
  NA: 'N/A',
  UNKNOWN: 'Unknown',

  SHOWING: 'Showing',
  ENTRIES: 'Entries',
  OF: 'of',
  TO: 'to',
  LIGHT: 'Light',
  DARK: 'Dark',
  OPEN_RATE: 'Open Rate',
  CLICK_RATE: 'Click Rate',
  REPLY_RATE: 'Reply Rate',
  BOUNCE_RATE: 'Bounce Rate',
  RESET: 'Reset',
  SUBMIT: 'Submit',
  SELECTED: 'Selected',

  // Form Names
  MODIFY_COMPANY_FORM: 'Modify Company Form',
  MODIFY_CONTACT_FORM: 'Modify Contact Form',
  MODIFY_DRAFT_FORM: 'Modify Draft Form',
  GENERATE_EMAIL_FORM: 'Generate Email Form',
  COMPOSE_EMAIL_FORM: 'Compose Email Form',
  MODIFY_SENDER_FORM: 'Modify Sender Form',
} as const

export const REQ_METHODS = {
  GET: 'get',
  POST: 'post',
  PATCH: 'patch',
  PUT: 'put',
  DELETE: 'delete',
} as const

export const DEFAULT_DATA_RESPONSE = {
  count: 0,
  data: [],
} as const

export const INPUT_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  EMAIL: 'email',
  PASSWORD: 'password',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  FILE: 'file',
} as const

export const ESPS: Record<ESP, string> = {
  sendgrid: 'Sendgrid',
  mailgun: 'Mailgun',
  postmark: 'Postmark',
  brevo: 'Brevo',
  'elastic-email': 'Elastic Email',
  mailjet: 'Mailjet',
} as const

export const EMAIL_EVENTS = {
  processed: 'processed',
  delivered: 'delivered',
  opened: 'opened',
  clicked: 'clicked',
} as const

export const REGEX = {
  UNSIGNED_INT: /^\d+$/,
  INT: /^-?\d+$/,
  UNSIGNED_FLOAT: /^\d+(\.\d+)?$/,
  FLOAT: /^-?\d+(\.\d+)?$/,
  MOBILE: /^\d{10}$/,
  LINKED_IN_URL:
    /^(?:https:\/\/)?(?:www\.)?linkedin\.com\/(?:in|company)\/[a-zA-Z0-9_-]+\/?$/,
} as const

// Rich Text Editor
export const HEADERS = [
  { value: '1', label: 'H1' },
  { value: '2', label: 'H2' },
  { value: '3', label: 'H3' },
  { value: '4', label: 'H4' },
]

export const FONT_SIZES = [
  { value: '8px', label: '8' },
  { value: '12px', label: '8' },
  { value: '16px', label: '16' },
  { value: '20px', label: '20' },
  { value: '24px', label: '24' },
  { value: '32px', label: '32' },
  { value: '48px', label: '48' },
]

export const FONTS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'monospace', label: 'monospace' },
]

export const TEXT_ALIGNMENTS = [
  {
    value: 'left',
    url: 'https://www.gstatic.com/images/icons/material/system_gm/1x/format_align_left_black_20dp.png',
  },
  {
    value: 'center',
    url: 'https://www.gstatic.com/images/icons/material/system_gm/1x/format_align_center_black_20dp.png',
  },
  {
    value: 'right',
    url: 'https://www.gstatic.com/images/icons/material/system_gm/1x/format_align_right_black_20dp.png',
  },
]
