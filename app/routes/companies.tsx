import {
  ShouldRevalidateFunction,
  useFetcher,
  useLoaderData,
  useNavigate,
} from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { deleteCompany, fetchCompanies } from '~/api/companies'
import { DataTable } from '~/components/shared/table/data-table'
import { ColumnDef } from '~/types/common'
import { ActionDropdown } from '~/components/shared/table/action-dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '~/context/modal-context'
import { Company, CompanyAction } from '~/types/company'
import { LABELS, NAMES, PLACEHOLDERS } from '~/lib/form'
import { formatDate } from '~/lib/utils'
import { SearchField } from '~/components/shared/form/search-field'
import { useDebounce } from '~/hooks/use-debounce'
import { Separator } from '~/components/ui/separator'
import { TableFooterSection } from '~/components/shared/table/table-footer-section'
import { VALUES } from '~/lib/values'
import { PageTitle } from '~/components/layout/page-title'
import { TableHeaderSection } from '~/components/shared/table/table-header-section'
import { DeleteCompanyModal } from '~/components/companies/delete-company-modal'

interface CompaniesRequest {
  action: CompanyAction
  search: string
  page: number
  id: string
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
  const { action, search, page, id }: CompaniesRequest = await request.json()

  const fetchData = async () => {
    const { count, data } = await fetchCompanies({
      search,
      page,
    })

    return { count, data }
  }

  switch (action) {
    case CompanyAction.REFETCH:
      return fetchData()

    case CompanyAction.DELETE:
      await deleteCompany(id)
      return fetchData()
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = () => {
  return false
}

export default function CompaniesPage() {
  const loaderData = useLoaderData<typeof loader>()

  const fetcher = useFetcher<CompaniesResponse>()

  // Global States
  const { openModal } = useModal()

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
      { action: CompanyAction.REFETCH, search, page },
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
      openModal('delete-company', { id })
    },
    [openModal]
  )

  const handleDeleteCompany = useCallback(
    (companyId: string) => {
      fetcher.submit(
        { action: CompanyAction.DELETE, id: companyId },
        {
          method: 'DELETE',
          encType: 'application/json',
        }
      )
    },
    [fetcher]
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
    <>
      <div className="h-full p-4">
        {/* Header */}
        <PageTitle title={LABELS.COMPANIES} />

        {/* Table Header */}
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

        {/* Table Footer */}
        <TableFooterSection
          page={page}
          setPage={setPage}
          pageSize={VALUES.COMPANIES_PAGE_SIZE}
          dataCount={companies.length}
          totalCount={count}
        />
      </div>

      <DeleteCompanyModal onDelete={handleDeleteCompany} />
    </>
  )
}
