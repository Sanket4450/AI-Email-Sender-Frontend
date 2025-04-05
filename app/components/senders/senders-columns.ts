import { ColumnDef } from '~/types/common'
import { Sender } from '~/types/sender'
import { createdAtColumn } from '../shared/table/common-columns'

export const senderColumns: ColumnDef<Sender>[] = [
  { accessorKey: 'displayName', header: 'Display Name' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'esp', header: 'Provider' },
  { accessorKey: 'priority', header: 'Priority' },
  { accessorKey: 'target', header: 'Target' },
  { accessorKey: 'sentCount', header: 'Sent Count' },
  createdAtColumn,
]
