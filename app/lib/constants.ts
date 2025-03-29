export const CONSTANTS = {
  // General
  APP_NAME: 'AI Email Sender',
  APP_DESCRIPTION: 'A personalized email sender with AI for better reach.',

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
