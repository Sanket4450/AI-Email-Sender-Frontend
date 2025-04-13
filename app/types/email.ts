import { EMAIL_EVENTS } from '~/lib/constants'
import { Contact } from './contact'
import { Sender } from './sender'
import { Tag } from './tag'

export interface Email {
  id: string
  subject: string
  body: string
  isBounced: boolean
  isSpamReported: boolean
  createdAt: string
  contact: Contact
  sender: Sender
  tags: Tag[]
  events: EmailEvent[]
}

export interface EmailEvent {
  id: string
  eventType: (typeof EMAIL_EVENTS)[keyof typeof EMAIL_EVENTS]
}
