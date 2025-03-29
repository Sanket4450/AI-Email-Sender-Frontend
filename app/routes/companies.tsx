import { useLoaderData } from '@remix-run/react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Pagination } from '~/components/ui/pagination'
import { fetchCompanies } from '~/api/companies'
import { DataTable } from '~/components/shared/table/data-table'
import { ColumnDef } from '~/types/common'
import { Company } from '~/types/Company'
import { ActionDropdown } from '~/components/shared/table/action-dropdown'

export async function loader({
  request,
}: {
  request: Request
}): Promise<{ companies: any[]; total: number }> {
  const url = new URL(request.url)
  const search = url.searchParams.get('search') || ''
  const page = Number(url.searchParams.get('page')) || 1

  const { companies, total } = await fetchCompanies({
    search,
    page,
  })

  return { companies, total }
}

export default function CompaniesPage() {
  const { companies, total } = useLoaderData<typeof loader>()

  // Columns for the DataTable
  const columns: ColumnDef<Company>[] = [
    { accessorKey: 'title', header: 'Company' },
    { accessorKey: 'location', header: 'Location' },
    { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'createdAt', header: 'Created At' },
    {
      id: 'actions',
      cell: ({ row }) => <ActionDropdown />,
    },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Companies</h1>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            + Add New
          </Button>
        </div>
        <Input
          type="text"
          placeholder="Search..."
          className="w-64"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={companies}
      />

      {/* Pagination */}
      <Pagination
        currentPage={1}
        totalPages={Math.ceil(total / 10)}
        onPageChange={(page) => console.log('Page changed:', page)}
      />
    </div>
  )
}
