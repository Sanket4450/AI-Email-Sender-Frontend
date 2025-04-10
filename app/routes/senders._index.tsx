import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react'
import { deleteSender, fetchESPs, fetchSenders } from '~/api/senders'
import { DataTable } from '~/components/shared/table/data-table'
import {
  ColumnDef,
  ResourceAction,
  Response,
  SelectOption,
} from '~/types/common'
import { ActionDropdown } from '~/components/shared/table/action-dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '~/context/modal-context'
import { Sender } from '~/types/sender'
import { LABELS, NAMES, PLACEHOLDERS } from '~/lib/form'
import { safeExecute } from '~/lib/utils'
import { SearchField } from '~/components/shared/form/search-field'
import { useDebouncedSearch } from '~/hooks/use-debounced-search'
import { Separator } from '~/components/ui/separator'
import { VALUES } from '~/lib/values'
import { PageTitle } from '~/components/layout/page-title'
import { TableHeaderSection } from '~/components/shared/table/table-header-section'
import { DeleteSenderModal } from '~/components/senders/delete-sender-modal'
import { toast } from 'sonner'
import { SUCCESS_MSG } from '~/lib/messages'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { CONSTANTS } from '~/lib/constants'
import { ActionBtn, CancelBtn } from '~/components/shared/ui/buttons'
import { senderColumns } from '~/components/senders/senders-columns'
import { CommonMultiSelectMenu } from '~/components/shared/form/common-multi-select-menu'

interface SendersRequest {
  action: ResourceAction
  search: string
  page: number
  id: string
}

interface SendersResponse {
  count: number
  data: Sender[]
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<SendersResponse> {
  const url = new URL(request.url)

  const search = url.searchParams.get(VALUES.SEARCH_QUERY_PARAM) || ''
  const selectedEspsStr: string =
    url.searchParams.get(VALUES.ESPS_QUERY_PARAM) || ''

  const esps: string[] = selectedEspsStr ? selectedEspsStr.split(',') : []

  const { count, data } = await fetchSenders({ search, esps })

  return { count, data }
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response | null> {
  const { action, id }: SendersRequest = await request.json()

  switch (action) {
    case ResourceAction.ESPS_REFETCH:
      return await safeExecute(async () => {
        const esps = await fetchESPs()
        return {
          success: true,
          action: ResourceAction.ESPS_REFETCH,
          message: SUCCESS_MSG.ESPS_FETCHED,
          result: esps,
        }
      })

    case ResourceAction.DELETE_SENDER:
      return await safeExecute(async () => {
        await deleteSender(id)
        return {
          success: true,
          action: ResourceAction.DELETE_SENDER,
          message: SUCCESS_MSG.SENDER_DELETED,
        }
      })

    default:
      return null
  }
}

export default function SendersPage() {
  const loaderData = useLoaderData<typeof loader>()

  const fetcher = useFetcher<Response>()

  const [searchParams, setSearchParams] = useSearchParams()

  const urlSearch =
    searchParams.get(VALUES.SEARCH_QUERY_PARAM) || VALUES.INITIAL_SEARCH

  const selectedEspsStr: string =
    searchParams.get(VALUES.ESPS_QUERY_PARAM) || ''

  const selectedESPs: string[] = selectedEspsStr
    ? selectedEspsStr.split(',')
    : []

  // Global States
  const { openModal, closeModal } = useModal()

  // Local States
  const [senders, setSenders] = useState<Sender[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchText, setSearchText] = useState(urlSearch)
  const [espOptions, setEspOptions] = useState<SelectOption[]>([])

  const navigate = useNavigate()

  const { search } = useDebouncedSearch(searchText)

  useEffect(() => {
    fetcher.submit(
      { action: ResourceAction.ESPS_REFETCH },
      {
        method: 'POST',
        encType: 'application/json',
      }
    )
  }, [])

  useEffect(() => {
    setSenders(loaderData.data)
    setTotalCount(loaderData.count)
  }, [loaderData])

  useEffect(() => {
    if (urlSearch !== search) {
      setSearchParams((params) => {
        params.set(VALUES.SEARCH_QUERY_PARAM, search)
        return params
      })
    }
  }, [search, urlSearch, setSearchParams])

  const setSelectedESPs = useCallback(
    (values: string[]) => {
      setSearchParams((params) => {
        params.set(VALUES.ESPS_QUERY_PARAM, values.join(','))
        return params
      })
    },
    [setSearchParams]
  )

  const resetFilter = useCallback(() => {
    setSearchParams({})
  }, [setSearchParams])

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      if (fetcher.data.success === false) {
        toast.error(fetcher.data.message)
      } else if (fetcher.data.action) {
        const { action } = fetcher.data

        switch (action) {
          case ResourceAction.ESPS_REFETCH:
            setEspOptions(fetcher.data.result)
            break

          case ResourceAction.DELETE_SENDER:
            toast.success(fetcher.data.message)
            closeModal('delete-sender')
            break

          default:
            break
        }
      }
    }
  }, [fetcher.state, fetcher.data])

  const navigateToAddSender = useCallback(() => {
    navigate('/senders/add')
  }, [navigate])

  const navigateToEditSender = useCallback(
    (id: string) => {
      navigate(`/senders/${id}/edit`)
    },
    [navigate]
  )

  const openDeleteModal = useCallback(
    (id: string) => {
      openModal('delete-sender', { id })
    },
    [openModal]
  )

  const handleDeleteSender = useCallback(
    (senderId: string) => {
      fetcher.submit(
        { action: ResourceAction.DELETE_SENDER, id: senderId },
        {
          method: 'DELETE',
          encType: 'application/json',
        }
      )
    },
    [fetcher]
  )

  // Columns for the DataTable
  const columns: ColumnDef<Sender>[] = useMemo(
    () => [
      ...senderColumns,
      {
        id: 'actions',
        cell: ({ row }) => (
          <ActionDropdown
            onEdit={() => navigateToEditSender(row.id)}
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
        <PageTitle
          title={LABELS.SENDERS}
          subtitle={`(${totalCount})`}
        />

        {/* Table Header */}
        <TableHeaderSection>
          <SearchField
            name={NAMES.SEARCH_SENDERS}
            placeholder={PLACEHOLDERS.SEARCH_SENDERS}
            value={searchText}
            onChange={setSearchText}
          />

          <div className="flex items-center gap-3">
            <div className="w-36">
              <CommonMultiSelectMenu
                data={espOptions}
                label={LABELS.PROVIDERS}
                placeholder={PLACEHOLDERS.PROVIDERS}
                selectedOptions={selectedESPs}
                onChange={setSelectedESPs}
                includeLabel={false}
                showSelectedLabels={false}
                readOnly={fetcher.state === 'loading'}
              />
            </div>

            <CancelBtn
              child={CONSTANTS.RESET}
              onClick={resetFilter}
            />

            <ActionBtn
              child={LABELS.ADD_NEW}
              onClick={navigateToAddSender}
            />
          </div>
        </TableHeaderSection>

        {/* Table */}
        <DataTable
          columns={columns}
          data={senders}
        />

        <Separator />
      </div>

      <DeleteSenderModal onDelete={handleDeleteSender} />
    </>
  )
}
