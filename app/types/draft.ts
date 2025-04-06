import { Contact } from './contact'
import { Sender } from './sender'

export interface Draft {
  id: string
  subject?: string
  body?: string
  scheduledAt?: string
  createdAt: string
  contacts: Contact[]
  sender?: Sender
}
