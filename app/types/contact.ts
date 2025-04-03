import { Company } from './company'
import { Tag } from './tag'

export interface Contact {
  id: string
  name: string
  position: string
  email: string
  phone?: string
  linkedInUrl?: string
  location?: string
  createdAt: string
  company: Company
  tags: Tag[]
}
