import {
  ShouldRevalidateFunction,
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react'
import { Button } from '~/components/ui/button'
import { deleteCompany, fetchCompanies } from '~/api/companies'
import { DataTable } from '~/components/shared/table/data-table'
import { ColumnDef } from '~/types/common'
import { ActionDropdown } from '~/components/shared/table/action-dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '~/context/modal-context'
import { Company, ResourceAction } from '~/types/company'
import { LABELS, NAMES, PLACEHOLDERS } from '~/lib/form'
import { formatDate, formatStringArray, safeExecute } from '~/lib/utils'
import { SearchField } from '~/components/shared/form/search-field'
import { useDebounce } from '~/hooks/use-debounce'
import { Separator } from '~/components/ui/separator'
import { TableFooterSection } from '~/components/shared/table/table-footer-section'
import { VALUES } from '~/lib/values'
import { PageTitle } from '~/components/layout/page-title'
import { TableHeaderSection } from '~/components/shared/table/table-header-section'
import { DeleteCompanyModal } from '~/components/companies/delete-company-modal'
import { toast } from 'sonner'
import { SUCCESS_MSG } from '~/lib/messages'
import { LoaderFunctionArgs } from '@remix-run/node'
import { CONSTANTS } from '~/lib/constants'

interface CompaniesRequest {
  action: ResourceAction
  search: string
  page: number
  id: string
}

interface CompaniesResponse {
  count: number
  data: Company[]
}

interface CompaniesActionResponse extends CompaniesResponse {
  action: ResourceAction
  error?: string
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<CompaniesResponse> {
  const url = new URL(request.url)

  const search = url.searchParams.get(VALUES.SEARCH_QUERY_PARAM) || ''
  const page = parseInt(
    url.searchParams.get(VALUES.PAGE_QUERY_PARAM) || '1',
    10
  )
  const { count, data } = await fetchCompanies({ search, page })

  return { count, data }
}

export async function action({
  request,
}: {
  request: Request
}): Promise<CompaniesActionResponse | null> {
  const { action, search, page, id }: CompaniesRequest = await request.json()

  const fetchData = async () => {
    const { count, data } = await fetchCompanies({
      search,
      page,
    })

    return { count, data }
  }

  switch (action) {
    case ResourceAction.COMPANIES_REFETCH:
      return {
        action: ResourceAction.COMPANIES_REFETCH,
        ...(await fetchData()),
      }

    case ResourceAction.DELETE_COMPANY:
      return await safeExecute(async () => {
        await deleteCompany(id)
        return { action: ResourceAction.DELETE_COMPANY, ...(await fetchData()) }
      })

    default:
      return null
  }
}

export const shouldRevalidate: ShouldRevalidateFunction = () => {
  return false
}

export default function CompaniesPage() {
  const loaderData = useLoaderData<typeof loader>()

  const fetcher = useFetcher<CompaniesActionResponse>()

  const [searchParams, setSearchParams] = useSearchParams()

  const searchFromUrl = searchParams.get(VALUES.SEARCH_QUERY_PARAM) || ''
  const pageFromUrl = parseInt(
    searchParams.get(VALUES.PAGE_QUERY_PARAM) || '1',
    10
  )

  // Global States
  const { openModal, closeModal } = useModal()

  // Local States
  const [companies, setCompanies] = useState<Company[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(pageFromUrl)
  const [searchText, setSearchText] = useState(searchFromUrl)

  const navigate = useNavigate()

  const { search } = useDebounce(searchText)

  useEffect(() => {
    setCompanies(loaderData.data)
    setTotalCount(loaderData.count)
  }, [loaderData])

  useEffect(() => {
    if (fetcher.data && !fetcher.data?.error) {
      setCompanies(fetcher.data.data)
      setTotalCount(fetcher.data.count)
    }
  }, [fetcher.data])

  useEffect(() => {
    console.log('search changed')
    const params = new URLSearchParams()
    if (search) params.set(VALUES.SEARCH_QUERY_PARAM, search)
    setSearchParams(params)
    // setPage(1)
  }, [search, page])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set(VALUES.PAGE_QUERY_PARAM, page.toString())
    setSearchParams(params)
  }, [page])

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      if (fetcher.data.error) {
        toast.error(fetcher.data.error)
      } else if (fetcher.data.action) {
        const { action } = fetcher.data

        switch (action) {
          case ResourceAction.DELETE_COMPANY:
            toast.success(SUCCESS_MSG.COMPANY_DELETED)
            closeModal('delete-company')
            break

          default:
            break
        }
      }
    }
  }, [fetcher.state, fetcher.data])

  useEffect(() => {
    fetcher.submit(
      { action: ResourceAction.COMPANIES_REFETCH, search, page: 1 },
      { method: 'POST', encType: 'application/json' }
    )
  }, [search])

  useEffect(() => {
    fetcher.submit(
      { action: ResourceAction.COMPANIES_REFETCH, search, page },
      { method: 'POST', encType: 'application/json' }
    )
  }, [page])

  const navigateToAddCompany = useCallback(() => {
    navigate('/companies/add')
  }, [navigate])

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
        { action: ResourceAction.DELETE_COMPANY, id: companyId },
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
        id: 'tags',
        header: 'Tags',
        cell: ({ row }) =>
          formatStringArray(row.tags, NAMES.TITLE) || CONSTANTS.NA,
      },
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
      <div className="h-full flex flex-col">
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

          <Button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={navigateToAddCompany}>
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
          totalCount={totalCount}
        />
      </div>

      <DeleteCompanyModal onDelete={handleDeleteCompany} />
    </>
  )
}
