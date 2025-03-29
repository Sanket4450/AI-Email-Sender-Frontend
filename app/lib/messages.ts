export const ERROR_MSG = {
  // General
  INTERNAL_SERVER_ERROR: 'Internal server error',
}


export const INFO_MSG = {
  TOGGLE_THEME: 'Toggle Theme',

  DELETE_COMPANY: 'Delete Company',
  DELETE_CONTACT: 'Delete Contact',
  DELETE_DRAFT: 'Delete Draft',
  DELETE_SENDER: 'Delete Sender',
  DELETE_SCHEDULED_EMAIL: 'Delete Scheduled Email',

  SURE_WANT_TO_DELETE: 'Are you sure you want to delete',
  ACTION_CANNOT_UNDONED: 'This action cannot be undone.',
}

export const WARNING_MSG = {
  // Delete
  DELETE_COMPANY_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} company {{companyName}}? ${INFO_MSG.ACTION_CANNOT_UNDONED}`,
  DELETE_CONTACT_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} contact {{contactName}}? ${INFO_MSG.ACTION_CANNOT_UNDONED}`,
  DELETE_DRAFT_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} this draft? ${INFO_MSG.ACTION_CANNOT_UNDONED}`,
  DELETE_EMAIL_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} this email? ${INFO_MSG.ACTION_CANNOT_UNDONED}`,
  DELETE_SENDER_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} sender {{senderName}}? ${INFO_MSG.ACTION_CANNOT_UNDONED}`,
}

export const SUCCESS_MSG = {}
