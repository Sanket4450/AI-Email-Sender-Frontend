export interface Response {
  success: boolean
  action?: ResourceAction
  message: string
  result?: any
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
  GENERATE_EMAIL = 'generate-email',
  SEND_EMAIL = 'send-email',
  SCHEDULE_EMAIL = 'schedule-email',
  EDIT_EMAIL = 'edit-email',
  DELETE_EMAIL = 'delete-email',

  // Senders
  SENDERS_REFETCH = 'senders-refetch',
  ESPS_REFETCH = 'esps-refetch',
  ADD_SENDER = 'add-sender',
  EDIT_SENDER = 'edit-sender',
  DELETE_SENDER = 'delete-sender',
}

export interface Pagination {
  page?: number
  limit?: number
}

export interface Search {
  search?: string
}


export interface AsOptions {
  asOptions?: boolean
}

export interface Filter extends Search, Pagination {}

export interface ColumnDef<T> {
  id?: string
  accessorKey?: string
  header?: React.ReactNode
  cell?: ({ row }: { row: T }) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  minWidth?: number
  maxWidth?: number
}

export interface SelectOption {
  value: string
  label: string
  subLabel?: string
}
