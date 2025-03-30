export const ERROR_MSG = {
  // General
  INTERNAL_SERVER_ERROR: 'Internal server error',
  SOMETHING_WENT_WRONG: 'Something Went Wrong!',
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

  NO_DATA_FOUND: 'No Data Found!',
  NO_COMPANIES_FOUND: 'No Companies Found!',
  NO_CONTACTS_FOUND: 'No Contacts Found!',
  NO_DRAFTS_FOUND: 'No Drafts Found!',
  NO_SENDERS_FOUND: 'No Senders Found!',
  NO_EMAILS_FOUND: 'No Emails Found!',
}

export const WARNING_MSG = {
  // Delete
  DELETE_COMPANY_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} company {{companyName}}? ${INFO_MSG.ACTION_CANNOT_UNDONED}`,
  DELETE_CONTACT_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} contact {{contactName}}? ${INFO_MSG.ACTION_CANNOT_UNDONED}`,
  DELETE_DRAFT_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} this draft? ${INFO_MSG.ACTION_CANNOT_UNDONED}`,
  DELETE_EMAIL_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} this email? ${INFO_MSG.ACTION_CANNOT_UNDONED}`,
  DELETE_SENDER_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} sender {{senderName}}? ${INFO_MSG.ACTION_CANNOT_UNDONED}`,
}

export const SUCCESS_MSG = {
  // General
  THEME_TOGGLED: 'Theme toggled successfully',

  // Add
  COMPANY_ADDED: 'Company added successfully',
  CONTACT_ADDED: 'Contact added successfully',
  DRAFT_ADDED: 'Draft added successfully',
  SENDER_ADDED: 'Sender added successfully',
  SCHEDULED_EMAIL_ADDED: 'Scheduled email added successfully',

  // Edit
  COMPANY_EDITED: 'Company edited successfully',
  CONTACT_EDITED: 'Contact edited successfully',
  DRAFT_EDITED: 'Draft edited successfully',
  SENDER_EDITED: 'Sender edited successfully',
  SCHEDULED_EMAIL_EDITED: 'Scheduled email edited successfully',

  // Delete
  COMPANY_DELETED: 'Company deleted successfully',
  CONTACT_DELETED: 'Contact deleted successfully',
  DRAFT_DELETED: 'Draft deleted successfully',
  SENDER_DELETED: 'Sender deleted successfully',
  SCHEDULED_EMAIL_DELETED: 'Scheduled email deleted successfully',
}
