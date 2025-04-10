import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react'
import { deleteDraft, fetchDrafts } from '~/api/drafts'
import { DataTable } from '~/components/shared/table/data-table'
import { ColumnDef, ResourceAction, Response } from '~/types/common'
import { ActionDropdown } from '~/components/shared/table/action-dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '~/context/modal-context'
import { Draft } from '~/types/draft'
import { LABELS, NAMES, PLACEHOLDERS } from '~/lib/form'
import { safeExecute } from '~/lib/utils'
import { SearchField } from '~/components/shared/form/search-field'
import { useDebouncedSearch } from '~/hooks/use-debounced-search'
import { Separator } from '~/components/ui/separator'
import { TableFooterSection } from '~/components/shared/table/table-footer-section'
import { VALUES } from '~/lib/values'
import { PageTitle } from '~/components/layout/page-title'
import { TableHeaderSection } from '~/components/shared/table/table-header-section'
import { DeleteDraftModal } from '~/components/drafts/delete-draft-modal'
import { toast } from 'sonner'
import { SUCCESS_MSG } from '~/lib/messages'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { CONSTANTS } from '~/lib/constants'
import { ActionBtn, CancelBtn } from '~/components/shared/ui/buttons'
import { draftColumns } from '~/components/drafts/drafts-columns'

interface DraftsRequest {
  action: ResourceAction
  search: string
  page: number
  id: string
}

interface DraftsResponse {
  count: number
  data: Draft[]
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<DraftsResponse> {
  const url = new URL(request.url)

  const search = url.searchParams.get(VALUES.SEARCH_QUERY_PARAM) || ''
  const page = parseInt(
    url.searchParams.get(VALUES.PAGE_QUERY_PARAM) || '1',
    10
  )
  const { count, data } = await fetchDrafts({ search, page })

  return { count, data }
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response | null> {
  const { action, id }: DraftsRequest = await request.json()

  switch (action) {
    case ResourceAction.DELETE_DRAFT:
      return await safeExecute(async () => {
        await deleteDraft(id)
        return {
          success: true,
          action: ResourceAction.DELETE_DRAFT,
          message: SUCCESS_MSG.DRAFT_DELETED,
        }
      })

    default:
      return null
  }
}

export default function DraftsPage() {
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
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchText, setSearchText] = useState(urlSearch)

  const navigate = useNavigate()

  const { search } = useDebouncedSearch(searchText)

  useEffect(() => {
    setDrafts(loaderData.data)
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
          case ResourceAction.DELETE_DRAFT:
            toast.success(fetcher.data.message)
            closeModal('delete-draft')
            break

          default:
            break
        }
      }
    }
  }, [fetcher.state, fetcher.data])

  const composeDraft = useCallback(() => {
    navigate('/compose')
  }, [navigate])

  const navigateToEditDraft = useCallback(
    (id: string) => {
      navigate(`/drafts/${id}/edit`)
    },
    [navigate]
  )

  const openDeleteModal = useCallback(
    (id: string) => {
      openModal('delete-draft', { id })
    },
    [openModal]
  )

  const handleDeleteDraft = useCallback(
    (draftId: string) => {
      fetcher.submit(
        { action: ResourceAction.DELETE_DRAFT, id: draftId },
        {
          method: 'DELETE',
          encType: 'application/json',
        }
      )
    },
    [fetcher]
  )

  // Columns for the DataTable
  const columns: ColumnDef<Draft>[] = useMemo(
    () => [
      ...draftColumns,
      {
        id: 'actions',
        cell: ({ row }) => (
          <ActionDropdown
            onEdit={() => navigateToEditDraft(row.id)}
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
        <PageTitle title={LABELS.DRAFTS} />

        {/* Table Header */}
        <TableHeaderSection>
          <SearchField
            name={NAMES.SEARCH_DRAFTS}
            placeholder={PLACEHOLDERS.SEARCH_DRAFTS}
            value={searchText}
            onChange={setSearchText}
          />

          <div className="flex items-center gap-3">
            <CancelBtn
              child={CONSTANTS.RESET}
              onClick={resetFilter}
            />

            <ActionBtn
              child={LABELS.COMPOSE_NEW}
              onClick={composeDraft}
            />
          </div>
        </TableHeaderSection>

        {/* Table */}
        <DataTable
          columns={columns}
          data={drafts}
        />

        <Separator />

        {/* Table Footer */}
        <TableFooterSection
          page={page}
          onPageChange={handlePageChange}
          pageSize={VALUES.DRAFTS_PAGE_SIZE}
          dataCount={drafts.length}
          totalCount={totalCount}
        />
      </div>

      <DeleteDraftModal onDelete={handleDeleteDraft} />
    </>
  )
}
