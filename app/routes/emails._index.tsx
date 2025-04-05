import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react'
import { fetchEmails } from '~/api/emails'
import { DataTable } from '~/components/shared/table/data-table'
import { ResourceAction, Response } from '~/types/common'
import { useCallback, useEffect, useState } from 'react'
import { Email } from '~/types/email'
import { LABELS, NAMES, PLACEHOLDERS } from '~/lib/form'
import { SearchField } from '~/components/shared/form/search-field'
import { useDebouncedSearch } from '~/hooks/use-debounced-search'
import { Separator } from '~/components/ui/separator'
import { TableFooterSection } from '~/components/shared/table/table-footer-section'
import { VALUES } from '~/lib/values'
import { PageTitle } from '~/components/layout/page-title'
import { TableHeaderSection } from '~/components/shared/table/table-header-section'
import { toast } from 'sonner'
import { LoaderFunctionArgs } from '@remix-run/node'
import { CONSTANTS } from '~/lib/constants'
import { ActionBtn, CancelBtn } from '~/components/shared/buttons'
import { emailColumns } from '~/components/emails/email-columns'

interface EmailsRequest {
  action: ResourceAction
  search: string
  page: number
  id: string
}

interface EmailsResponse {
  count: number
  data: Email[]
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<EmailsResponse> {
  const url = new URL(request.url)

  const search = url.searchParams.get(VALUES.SEARCH_QUERY_PARAM) || ''
  const page = parseInt(
    url.searchParams.get(VALUES.PAGE_QUERY_PARAM) || '1',
    10
  )
  const { count, data } = await fetchEmails({ search, page })

  return { count, data }
}

export async function action({
  request,
}: {
  request: Request
}): Promise<Response | null> {
  const { action }: EmailsRequest = await request.json()

  switch (action) {
    default:
      return null
  }
}

export default function EmailsPage() {
  const loaderData = useLoaderData<typeof loader>()

  const fetcher = useFetcher<Response>()

  const [searchParams, setSearchParams] = useSearchParams()

  const urlSearch =
    searchParams.get(VALUES.SEARCH_QUERY_PARAM) || VALUES.INITIAL_SEARCH
  const page = parseInt(
    searchParams.get(VALUES.PAGE_QUERY_PARAM) || VALUES.INITIAL_PAGE_PARAM
  )

  // Global States

  // Local States
  const [emails, setEmails] = useState<Email[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchText, setSearchText] = useState(urlSearch)

  const navigate = useNavigate()

  const { search } = useDebouncedSearch(searchText)

  useEffect(() => {
    setEmails(loaderData.data)
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
    setSearchParams({})
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
          default:
            break
        }
      }
    }
  }, [fetcher.state, fetcher.data])

  const navigateToAddEmail = useCallback(() => {
    navigate('/emails/add')
  }, [navigate])

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <PageTitle title={LABELS.EMAILS} />

        {/* Table Header */}
        <TableHeaderSection>
          <SearchField
            name={NAMES.SEARCH_EMAILS}
            placeholder={PLACEHOLDERS.SEARCH_EMAILS}
            value={searchText}
            onChange={setSearchText}
          />

          <div className="flex items-center gap-3">
            <CancelBtn
              child={CONSTANTS.RESET}
              onClick={resetFilter}
            />

            <ActionBtn
              child={LABELS.WRITE_NEW}
              onClick={navigateToAddEmail}
            />
          </div>
        </TableHeaderSection>

        {/* Table */}
        <DataTable
          columns={emailColumns}
          data={emails}
        />

        <Separator />

        {/* Table Footer */}
        <TableFooterSection
          page={page}
          onPageChange={handlePageChange}
          pageSize={VALUES.EMAILS_PAGE_SIZE}
          dataCount={emails.length}
          totalCount={totalCount}
        />
      </div>
    </>
  )
}
