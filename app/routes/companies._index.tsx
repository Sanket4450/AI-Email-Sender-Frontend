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
import { useDebouncedSearch } from '~/hooks/use-debounced-search'
import { Separator } from '~/components/ui/separator'
import { TableFooterSection } from '~/components/shared/table/table-footer-section'
import { VALUES } from '~/lib/values'
import { PageTitle } from '~/components/layout/page-title'
import { TableHeaderSection } from '~/components/shared/table/table-header-section'
import { DeleteCompanyModal } from '~/components/companies/delete-company-modal'
import { toast } from 'sonner'
import { SUCCESS_MSG } from '~/lib/messages'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { CONSTANTS } from '~/lib/constants'
import { ActionBtn, CancelBtn } from '~/components/shared/ui/buttons'
import { companyColumns } from '~/components/companies/company-columns'

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
}: ActionFunctionArgs): Promise<Response | null> {
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

  const { search } = useDebouncedSearch(searchText)

  useEffect(() => {
    setCompanies(loaderData.data)
    setTotalCount(loaderData.count)
  }, [loaderData])

  useEffect(() => {
    if (urlSearch !== search) {
      setSearchParams((params) => {
        params.set(VALUES.SEARCH_QUERY_PARAM, search)
        params.set(VALUES.PAGE_QUERY_PARAM, VALUES.INITIAL_PAGE_PARAM)
        return params
      })
    }
  }, [search, urlSearch, setSearchParams])

  const resetFilter = useCallback(() => {
    setSearchParams((params) => {
      params.set(VALUES.SEARCH_QUERY_PARAM, VALUES.INITIAL_SEARCH)
      params.set(VALUES.PAGE_QUERY_PARAM, VALUES.INITIAL_PAGE_PARAM)
      return params
    })
  }, [setSearchParams])

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams((params) => {
        params.set(VALUES.PAGE_QUERY_PARAM, newPage.toString())
        return params
      })
    },
    [setSearchParams]
  )

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
      ...companyColumns,
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
              onClick={resetFilter}
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
