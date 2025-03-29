import { Tag } from './tag'

export interface Company {
  id: string
  title: string
  description: string
  location: string
  createdAt: Date
  tags: Tag[]
}
