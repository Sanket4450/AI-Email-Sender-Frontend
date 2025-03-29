import {
  ShouldRevalidateFunction,
  useFetcher,
  useLoaderData,
  useNavigate,
} from '@remix-run/react'
import { Button } from '~/components/ui/button'
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
import { Separator } from '~/components/ui/separator'
import { TableFooter } from '~/components/ui/table'
import { TableFooterSection } from '~/components/shared/table/table-footer-section'
import { VALUES } from '~/lib/values'
import { PageTitle } from '~/components/layout/page-title'
import { TableHeaderSection } from '~/components/shared/table/table-header-section'

interface CompaniesRequest {
  search: string
  page: number
}

interface CompaniesResponse {
  count: number
  data: Company[]
}

export async function loader(): Promise<CompaniesResponse> {
  const { count, data } = await fetchCompanies({ search: '', page: 1 })

  return { count, data }
}

export async function action({ request }: { request: Request }) {
  const { search, page }: CompaniesRequest = await request.json()

  const { count, data } = await fetchCompanies({
    search,
    page,
  })

  return { count, data }
}

export const shouldRevalidate: ShouldRevalidateFunction = () => {
  return false
}

export default function CompaniesPage() {
  const loaderData = useLoaderData<typeof loader>()

  const fetcher = useFetcher<CompaniesResponse>()

  // Global States
  const { openModal, isModalOpen } = useModal()

  // Local States
  const [page, setPage] = useState(1)
  const [searchText, setSearchText] = useState('')

  const navigate = useNavigate()

  const { search } = useDebounce(searchText)

  const { data: companies, count }: CompaniesResponse = useMemo(() => {
    if (fetcher.data) {
      return fetcher.data
    }
    return loaderData
  }, [fetcher.data, loaderData])

  useEffect(() => {
    fetcher.submit(
      { search, page },
      { method: 'POST', encType: 'application/json' }
    )
  }, [search])

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
    <div className="h-full p-4">
      {/* Header */}
      <PageTitle title={LABELS.COMPANIES} />

      <TableHeaderSection>
        <SearchField
          name={NAMES.SEARCH_COMPANIES}
          placeholder={PLACEHOLDERS.SEARCH_COMPANIES}
          value={searchText}
          onChange={setSearchText}
        />

        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {LABELS.ADD_NEW}
        </Button>
      </TableHeaderSection>

      {/* Table */}
      <DataTable
        columns={columns}
        data={companies}
      />

      <Separator />

      <TableFooterSection
        page={page}
        setPage={setPage}
        pageSize={VALUES.COMPANIES_PAGE_SIZE}
        dataCount={companies.length}
        totalCount={count}
      />
    </div>
  )
}
