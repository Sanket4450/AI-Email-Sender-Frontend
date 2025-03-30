import { Tag } from './tag'

export interface Company {
  id: string
  title: string
  description: string
  location: string
  createdAt: string
  tags: Tag[]
}

export enum ResourceAction {
  // Companies
  COMPANIES_REFETCH = 'companies-refetch',
  ADD_COMPANY = 'add-company',
  EDIT_COMPANY = 'edit-company',
  DELETE_COMPANY = 'delete-company',

  // Contacts
  CONTACTS_REFETCH = 'contacts-refetch',
  ADD_CONTACT = 'add-contact',
  EDIT_CONTACT = 'edit-contact',
  DELETE_CONTACT = 'delete-contact',

  // Tags
  TAGS_REFETCH = 'tags-refetch',
  ADD_TAG = 'add-tag',
  EDIT_TAG = 'edit-tag',
  DELETE_TAG = 'delete-tag',

  // Drafts
  DRAFTS_REFETCH = 'drafts-refetch',
  ADD_DRAFT = 'add-draft',
  EDIT_DRAFT = 'edit-draft',
  DELETE_DRAFT = 'delete-draft',

  // Emails
  EMAILS_REFETCH = 'emails-refetch',
  SEND_EMAIL = 'send-email',
  EDIT_EMAIL = 'edit-email',
  DELETE_EMAIL = 'delete-email',

  // Senders
  SENDERS_REFETCH = 'senders-refetch',
  ADD_SENDER = 'add-sender',
  EDIT_SENDER = 'edit-sender',
  DELETE_SENDER = 'delete-sender',
}
