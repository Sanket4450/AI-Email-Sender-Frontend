import { LABELS } from '~/lib/form'
import { formatDate } from '~/lib/utils'
import { ColumnDef } from '~/types/common'

export const createdAtColumn = (
  label: string = LABELS.CREATED_AT
): ColumnDef<any> => ({
  id: 'createdAt',
  header: label,
  cell: ({ row }) => formatDate(row.createdAt),
})
