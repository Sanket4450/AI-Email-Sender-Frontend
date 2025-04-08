import { CONSTANTS } from '~/lib/constants'
import { NAMES } from '~/lib/form'
import { formatDate, formatStringArray } from '~/lib/utils'
import { ColumnDef } from '~/types/common'
import { Draft } from '~/types/draft'
import { createdAtColumn } from '../shared/table/common-columns'

export const draftColumns: ColumnDef<Draft>[] = [
  { accessorKey: 'subject', header: 'Subject' },
  {
    id: 'sender',
    header: 'Sender',
    cell: ({ row }) => row.sender?.displayName || CONSTANTS.NA,
  },
  {
    id: 'scheduledAt',
    header: 'Scheduled At',
    minWidth: 105,
    cell: ({ row }) =>
      row.scheduledAt ? formatDate(row.scheduledAt) : CONSTANTS.NA,
  },
  {
    id: 'contacts',
    header: 'Contacts',
    cell: ({ row }) => formatStringArray(row.contacts, NAMES.NAME) || CONSTANTS.NA,
  },
  createdAtColumn(),
]
