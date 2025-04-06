import { ColumnDef } from '~/types/common'
import { Sender } from '~/types/sender'
import { createdAtColumn } from '../shared/table/common-columns'
import { CONSTANTS, ESPS } from '~/lib/constants'

export const senderColumns: ColumnDef<Sender>[] = [
  { accessorKey: 'displayName', header: 'Display Name' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  {
    id: 'esp',
    header: 'Provider',
    cell: ({ row }) => ESPS[row.esp] || CONSTANTS.UNKNOWN,
  },
  { accessorKey: 'priority', header: 'Priority', align: 'right' },
  { accessorKey: 'target', header: 'Target', align: 'right' },
  { accessorKey: 'sentCount', header: 'Sent Count', align: 'right', minWidth: 90 },
  createdAtColumn(),
]
