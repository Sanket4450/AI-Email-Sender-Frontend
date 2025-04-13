export const ERROR_MSG = {
  // General
  INTERNAL_SERVER_ERROR: 'Internal server error',
  SOMETHING_WENT_WRONG: 'Something Went Wrong!',
  INVALID_URL: 'Invalid URL',

  SELECT_CONTACTS: 'Please select at least one contact',
  SELECT_SENDER: 'Please select a sender',
  EMAIL_BODY_NOT_EMPTY: 'Email body cannot be empty',
  ESP_NOT_SELECTED: 'Please select an ESP',
}

export const INFO_MSG = {
  TOGGLE_THEME: 'Toggle Theme',

  DELETE_COMPANY: 'Delete Company',
  DELETE_CONTACT: 'Delete Contact',
  DELETE_DRAFT: 'Delete Draft',
  DELETE_SENDER: 'Delete Sender',
  DELETE_TAG: 'Delete Tag',

  EDIT_TAG: 'Edit Tag',
  ADD_TAG: 'Add Tag',

  SURE_WANT_TO_DELETE: 'Are you sure you want to delete',
  ACTION_CANNOT_UNDONE: 'This action cannot be undone.',

  NO_DATA_FOUND: 'No Data Found!',
  NO_COMPANIES_FOUND: 'No Companies Found!',
  NO_CONTACTS_FOUND: 'No Contacts Found!',
  NO_DRAFTS_FOUND: 'No Drafts Found!',
  NO_SENDERS_FOUND: 'No Senders Found!',
  NO_EMAILS_FOUND: 'No Emails Found!',
  NO_TAGS_FOUND: 'No Tags Found!',
}

export const WARNING_MSG = {
  // Delete
  DELETE_COMPANY_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} company {{companyName}}? ${INFO_MSG.ACTION_CANNOT_UNDONE}`,
  DELETE_CONTACT_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} contact {{contactName}}? ${INFO_MSG.ACTION_CANNOT_UNDONE}`,
  DELETE_DRAFT_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} this draft? ${INFO_MSG.ACTION_CANNOT_UNDONE}`,
  DELETE_EMAIL_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} this email? ${INFO_MSG.ACTION_CANNOT_UNDONE}`,
  DELETE_SENDER_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} sender {{senderName}}? ${INFO_MSG.ACTION_CANNOT_UNDONE}`,
  DELETE_TAG_STARTING: `${INFO_MSG.SURE_WANT_TO_DELETE} tag {{tagName}}? ${INFO_MSG.ACTION_CANNOT_UNDONE}`,
}

export const SUCCESS_MSG = {
  // General
  THEME_TOGGLED: 'Theme toggled successfully',

  // Fetch
  COMPANIES_FETCHED: 'Companies fetched successfully',
  CONTACTS_FETCHED: 'Contacts fetched successfully',
  DRAFTS_FETCHED: 'Drafts fetched successfully',
  SENDERS_FETCHED: 'Senders fetched successfully',
  EMAILS_FETCHED: 'Emails fetched successfully',
  TAGS_FETCHED: 'Tags fetched successfully',
  ESPS_FETCHED: 'ESPs fetched successfully',

  // Add
  COMPANY_ADDED: 'Company added successfully',
  CONTACT_ADDED: 'Contact added successfully',
  DRAFT_ADDED: 'Draft added successfully',
  SENDER_ADDED: 'Sender added successfully',
  SCHEDULED_EMAIL_ADDED: 'Scheduled email added successfully',
  TAG_ADDED: 'Tag added successfully',

  // Update
  COMPANY_UPDATED: 'Company updated successfully',
  CONTACT_UPDATED: 'Contact updated successfully',
  DRAFT_UPDATED: 'Draft updated successfully',
  SENDER_UPDATED: 'Sender updated successfully',
  SCHEDULED_EMAIL_UPDATED: 'Scheduled email updated successfully',
  TAG_UPDATED: 'Tag updated successfully',

  // Delete
  COMPANY_DELETED: 'Company deleted successfully',
  CONTACT_DELETED: 'Contact deleted successfully',
  DRAFT_DELETED: 'Draft deleted successfully',
  SENDER_DELETED: 'Sender deleted successfully',
  SCHEDULED_EMAIL_DELETED: 'Scheduled email deleted successfully',
  TAG_DELETED: 'Tag deleted successfully',

  EMAIL_SAVED: 'Email saved as draft.',
  EMAIL_SCHEDULED: 'Email scheduled successfully',
  EMAIL_SENT: 'Email sent successfully',
  EMAIL_GENERATED: 'Email generated successfully',
}
