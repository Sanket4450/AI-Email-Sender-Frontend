import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Pagination } from '~/components/ui/pagination'
import { fetchCompanies } from '~/api/companies'
import { DataTable } from '~/components/shared/table/data-table'
import { ColumnDef } from '~/types/common'
import { ActionDropdown } from '~/components/shared/table/action-dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ModalType, useModal } from '~/context/modal-context'
import { Company } from '~/types/company'
import { LABELS, NAMES, PLACEHOLDERS } from '~/lib/form'
import { formatDate } from '~/lib/utils'
import { SearchField } from '~/components/shared/form/search-field'
import { useDebounce } from '~/hooks/use-debounce'
import { VALUES } from '~/lib/values'

interface CompaniesResponse {
  count: number
  data: Company[]
}

export async function loader({
  request,
}: {
  request: Request
}): Promise<CompaniesResponse> {
  const url = new URL(request.url)
  const search = url.searchParams.get('search') || ''
  const page = Number(url.searchParams.get('page')) || 1

  const { count, data } = await fetchCompanies({
    search,
    page,
  })

  return { count, data }
}

export default function CompaniesPage() {
  const { data: companies, count } = useLoaderData<typeof loader>()

  const { openModal, isModalOpen } = useModal()

  // Local States
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState('')

  const totalPages = Math.ceil(count / VALUES.COMPANIES_PAGE_SIZE)

  const fetcher = useFetcher()

  const navigate = useNavigate()

  const { search } = useDebounce(searchText)

  useEffect(() => {
    fetcher.submit({ search, page })
  }, [search])

  useEffect(() => {
    console.log(companies, 'companies change')
  }, [companies])

  useEffect(() => {
    if (fetcher.data) {
      console.log('data comes', fetcher.data)
    }
  }, [fetcher.data])

  const navigateToEditCompany = useCallback(
    (id: string) => {
      navigate(`/companies/${id}/edit`)
    },
    [navigate]
  )

  const openDeleteModal = useCallback(
    (id: string) => {
      openModal(ModalType.deleteCompany, { id })
    },
    [openModal]
  )

  // Columns for the DataTable
  const columns: ColumnDef<Company>[] = useMemo(
    () => [
      { accessorKey: 'title', header: 'Company' },
      { accessorKey: 'description', header: 'Description', width: 200 },
      { accessorKey: 'location', header: 'Location' },
      {
        id: 'createdAt',
        header: 'Created At',
        cell: ({ row }) => formatDate(row.createdAt),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <ActionDropdown
            onEdit={() => navigateToEditCompany(row.id)}
            onDelete={() => openDeleteModal(row.id)}
          />
        ),
      },
    ],
    []
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{LABELS.COMPANIES}</h1>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <SearchField
          name={NAMES.SEARCH_COMPANIES}
          placeholder={PLACEHOLDERS.SEARCH_COMPANIES}
          value={searchText}
          onChange={setSearchText}
        />

        <div>
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            {LABELS.ADD_NEW}
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={companies}
      />

      {/* Pagination */}
      <Pagination />
    </div>
  )
}
