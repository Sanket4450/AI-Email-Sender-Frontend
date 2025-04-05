import { Contact } from './contact'

export interface Email {
  id: string
  subject: string
  body: string
  isBounced: boolean
  isspamreported: boolean
  createdAt: string
  contact: Contact
}
