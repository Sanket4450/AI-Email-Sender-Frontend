import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react'
import { deleteCompany, fetchCompanies } from '~/api/companies'
import { DataTable } from '~/components/shared/table/data-table'
import { ColumnDef, ResourceAction, Response } from '~/types/common'
import { ActionDropdown } from '~/components/shared/table/action-dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '~/context/modal-context'
import { Company } from '~/types/company'
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
import { ActionBtn, CancelBtn } from '~/components/shared/buttons'

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
}): Promise<Response | null> {
  const { action, id }: CompaniesRequest = await request.json()

  switch (action) {
    case ResourceAction.DELETE_COMPANY:
      return await safeExecute(async () => {
        await deleteCompany(id)
        return {
          success: true,
          action: ResourceAction.DELETE_COMPANY,
          message: SUCCESS_MSG.COMPANY_DELETED,
        }
      })

    default:
      return null
  }
}

export default function CompaniesPage() {
  const loaderData = useLoaderData<typeof loader>()

  const fetcher = useFetcher<Response>()

  const [searchParams, setSearchParams] = useSearchParams()

  const urlSearch =
    searchParams.get(VALUES.SEARCH_QUERY_PARAM) || VALUES.INITIAL_SEARCH
  const page = parseInt(
    searchParams.get(VALUES.PAGE_QUERY_PARAM) || VALUES.INITIAL_PAGE_PARAM
  )

  // Global States
  const { openModal, closeModal } = useModal()

  // Local States
  const [companies, setCompanies] = useState<Company[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchText, setSearchText] = useState(urlSearch)

  const navigate = useNavigate()

  const { search } = useDebounce(searchText)

  useEffect(() => {
    setCompanies(loaderData.data)
    setTotalCount(loaderData.count)
  }, [loaderData])

  useEffect(() => {
    const params = new URLSearchParams()

    if (urlSearch !== search) {
      params.set(VALUES.SEARCH_QUERY_PARAM, search)
      params.set(VALUES.PAGE_QUERY_PARAM, VALUES.INITIAL_PAGE_PARAM)
      setSearchParams(params)
    }
  }, [search, urlSearch])

  const resetFilterState = useCallback(() => {
    const params = new URLSearchParams()
    params.set(VALUES.SEARCH_QUERY_PARAM, VALUES.INITIAL_SEARCH)
    params.set(VALUES.PAGE_QUERY_PARAM, VALUES.INITIAL_PAGE_PARAM)
    setSearchParams(params)
  }, [])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams()
    params.set(VALUES.PAGE_QUERY_PARAM, newPage.toString())
    setSearchParams(params)
  }

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      if (fetcher.data.success === false) {
        toast.error(fetcher.data.message)
      } else if (fetcher.data.action) {
        const { action } = fetcher.data

        switch (action) {
          case ResourceAction.DELETE_COMPANY:
            toast.success(fetcher.data.message)
            closeModal('delete-company')
            break

          default:
            break
        }
      }
    }
  }, [fetcher.state, fetcher.data])

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

          <div className="flex items-center gap-3">
            <CancelBtn
              child={CONSTANTS.RESET}
              onClick={resetFilterState}
            />

            <ActionBtn
              child={LABELS.ADD_NEW}
              onClick={navigateToAddCompany}
            />
          </div>
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
          onPageChange={handlePageChange}
          pageSize={VALUES.COMPANIES_PAGE_SIZE}
          dataCount={companies.length}
          totalCount={totalCount}
        />
      </div>

      <DeleteCompanyModal onDelete={handleDeleteCompany} />
    </>
  )
}
