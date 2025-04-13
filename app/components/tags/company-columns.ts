import { CONSTANTS } from '~/lib/constants'
import { NAMES } from '~/lib/form'
import { formatDate, formatStringArray } from '~/lib/utils'
import { ColumnDef } from '~/types/common'
import { Company } from '~/types/company'
import { createdAtColumn } from '../shared/table/common-columns'

export const companyColumns: ColumnDef<Company>[] = [
  { accessorKey: 'title', header: 'Name' },
  { accessorKey: 'description', header: 'Description', maxWidth: 200 },
  { accessorKey: 'location', header: 'Location' },
  {
    id: 'tags',
    header: 'Tags',
    cell: ({ row }) => formatStringArray(row.tags, NAMES.TITLE) || CONSTANTS.NA,
  },
  createdAtColumn(),
]
