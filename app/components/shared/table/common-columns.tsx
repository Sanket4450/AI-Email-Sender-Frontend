import { formatDate } from '~/lib/utils'
import { ColumnDef } from '~/types/common'

export const createdAtColumn: ColumnDef<any> = {
  id: 'createdAt',
  header: 'Created At',
  cell: ({ row }) => formatDate(row.createdAt),
}
