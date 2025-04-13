import { Contact } from './contact'
import { Sender } from './sender'
import { Tag } from './tag'

export interface Draft {
  id: string
  subject?: string
  body?: string
  scheduledAt?: string
  createdAt: string
  contacts: Contact[]
  tags: Tag[]
  sender?: Sender
}
