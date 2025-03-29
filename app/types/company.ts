import { Tag } from './tag'

export interface Company {
  id: string
  title: string
  description: string
  location: string
  createdAt: string
  tags: Tag[]
}

export enum CompanyAction {
  REFETCH = 'companies-refetch',
  ADD = 'company-add',
  EDIT = 'company-edit',
  DELETE = 'company-delete',
}
