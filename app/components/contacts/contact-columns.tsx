import { CONSTANTS } from '~/lib/constants'
import { NAMES } from '~/lib/form'
import { formatDate, formatStringArray } from '~/lib/utils'
import { ColumnDef } from '~/types/common'
import { Contact } from '~/types/contact'

export const contactColumns: ColumnDef<Contact>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'position', header: 'Position' },
  {
    id: 'company',
    header: 'Company',
    cell: ({ row }) => row.company.title,
  },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'linkedInUrl',
    header: 'LinkedIn',
    minWidth: 80,
  },
  { accessorKey: 'location', header: 'Address' },
  {
    id: 'tags',
    header: 'Tags',
    cell: ({ row }) => formatStringArray(row.tags, NAMES.TITLE) || CONSTANTS.NA,
  },
  {
    id: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => formatDate(row.createdAt),
  },
]
