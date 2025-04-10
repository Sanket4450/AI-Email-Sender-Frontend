import { ColumnDef } from '~/types/common'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table'
import { CONSTANTS } from '~/lib/constants'

interface CompaniesTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
}

export const DataTable = <T,>({ columns, data }: CompaniesTableProps<T>) => {
  return (
    <Table>
      <TableHeader className="sticky top-0 bg-background">
        <TableRow>
          {columns.map((c) => (
            <TableHead
              key={c.accessorKey || c.id}
              className=""
              style={{ textAlign: c.align || 'left' }}>
              {c.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, idx) => (
          <TableRow
            key={idx}
            className="">
            {columns.map((c) => {
              const cellValue = c.cell
                ? c.cell({ row })
                : c.accessorKey
                ? (row as Record<string, any>)[c.accessorKey] ?? CONSTANTS.NA
                : null

              return (
                <TableCell
                  key={c.accessorKey || c.id}
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{
                    textAlign: c.align || 'left',
                    minWidth: c.minWidth || 'auto',
                    maxWidth: c.maxWidth || 'auto',
                  }}>
                  {cellValue}
                </TableCell>
              )
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
