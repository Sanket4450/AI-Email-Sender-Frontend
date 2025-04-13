import { ColumnDef } from '~/types/common'
import { Tag } from '~/types/tag'
import { createdAtColumn } from '../shared/table/common-columns'

export const tagColumns: ColumnDef<Tag>[] = [
  { accessorKey: 'title', header: 'Name' },
  { accessorKey: 'companyCount', header: 'Companies', align: 'right' },
  { accessorKey: 'contactCount', header: 'Contacts', align: 'right' },
  { accessorKey: 'emailCount', header: 'Emails', align: 'right' },
  { accessorKey: 'draftCount', header: 'Drafts', align: 'right' },
  createdAtColumn(),
]
