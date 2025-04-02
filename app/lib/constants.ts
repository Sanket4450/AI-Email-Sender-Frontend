export const CONSTANTS = {
  // General
  APP_NAME: 'AI Email Sender',
  APP_DESCRIPTION: 'A personalized email sender with AI for better reach.',
  NA: 'N/A',

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

  // Form Names
  MODIFY_COMPANY_FORM: 'Modify Company Form',
  MODIFY_CONTACT_FORM: 'Modify Contact Form',
  MODIFY_DRAFT_FORM: 'Modify Draft Form',
  MODIFY_Email_FORM: 'Modify Email Form',
  MODIFY_SENDER_FORM: 'Modify Sender Form',
  
}

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
}

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
}
