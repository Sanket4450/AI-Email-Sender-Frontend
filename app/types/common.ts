export interface Pagination {
  page?: number
  limit?: number
}

export interface Search {
  search?: string
}

export interface ColumnDef<T> {
  id?: string
  accessorKey?: string
  header?: React.ReactNode
  cell?: ({ row }: { row: T }) => React.ReactNode
  align?: 'left' | 'center' | 'right',
  width?: number
}
