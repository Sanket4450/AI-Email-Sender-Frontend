import { Company } from './Company'
import { Tag } from './tag'

export interface Contact {
  id: string
  name: string
  position: string
  email: string
  linkedInUrl?: string
  location?: string
  createdAt: Date
  company: Company
  tags: Tag[]
}
