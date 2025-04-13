import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react'
import { addTag, deleteTag, fetchTags, updateTag } from '~/api/tags'
import { DataTable } from '~/components/shared/table/data-table'
import { ColumnDef, ResourceAction, Response } from '~/types/common'
import { ActionDropdown } from '~/components/shared/table/action-dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '~/context/modal-context'
import { Tag } from '~/types/tag'
import { LABELS, NAMES, PLACEHOLDERS } from '~/lib/form'
import { safeExecute } from '~/lib/utils'
import { SearchField } from '~/components/shared/form/search-field'
import { useDebouncedSearch } from '~/hooks/use-debounced-search'
import { Separator } from '~/components/ui/separator'
import { TableFooterSection } from '~/components/shared/table/table-footer-section'
import { VALUES } from '~/lib/values'
import { PageTitle } from '~/components/layout/page-title'
import { TableHeaderSection } from '~/components/shared/table/table-header-section'
import { DeleteTagModal } from '~/components/tags/delete-tag-modal'
import { toast } from 'sonner'
import { SUCCESS_MSG } from '~/lib/messages'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { CONSTANTS } from '~/lib/constants'
import { ActionBtn, CancelBtn } from '~/components/shared/ui/buttons'
import { tagColumns } from '~/components/tags/tag-columns'
import { ModifyTagModal } from '~/components/tags/modify-tag-modal'
import { ModifyTag } from '~/schemas/tag'

interface TagsRequest {
  action: ResourceAction
  search: string
  page: number
  id: string
}

interface TagsResponse {
  count: number
  data: Tag[]
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<TagsResponse> {
  const url = new URL(request.url)

  const search = url.searchParams.get(VALUES.SEARCH_QUERY_PARAM) || ''
  const page = parseInt(
    url.searchParams.get(VALUES.PAGE_QUERY_PARAM) || '1',
    10
  )
  const { count, data } = await fetchTags({ search, page })

  return { count, data }
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response | null> {
  const { action, id, ...data }: TagsRequest = await request.json()

  switch (action) {
    case ResourceAction.DELETE_TAG:
      return await safeExecute(async () => {
        await deleteTag(id)
        return {
          success: true,
          action: ResourceAction.DELETE_TAG,
          message: SUCCESS_MSG.TAG_DELETED,
        }
      })

    case ResourceAction.ADD_TAG:
      return await safeExecute(async () => {
        await addTag(data)
        return {
          success: true,
          action: ResourceAction.ADD_TAG,
          message: SUCCESS_MSG.TAG_ADDED,
        }
      })

    case ResourceAction.EDIT_TAG:
      return await safeExecute(async () => {
        await updateTag(id, data)
        return {
          success: true,
          action: ResourceAction.EDIT_TAG,
          message: SUCCESS_MSG.TAG_UPDATED,
        }
      })

    default:
      return null
  }
}

export default function TagsPage() {
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
  const [tags, setTags] = useState<Tag[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchText, setSearchText] = useState(urlSearch)

  const navigate = useNavigate()

  const { search } = useDebouncedSearch(searchText)

  useEffect(() => {
    setTags(loaderData.data)
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

  const closeModifyTagModal = () => {
    closeModal('modify-tag')
  }

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      if (fetcher.data.success === false) {
        toast.error(fetcher.data.message)
      } else if (fetcher.data.action) {
        const { action } = fetcher.data

        switch (action) {
          case ResourceAction.ADD_TAG:
            toast.success(fetcher.data.message)
            closeModifyTagModal()
            break

          case ResourceAction.EDIT_TAG:
            toast.success(fetcher.data.message)
            closeModifyTagModal()
            break

          case ResourceAction.DELETE_TAG:
            toast.success(fetcher.data.message)
            closeModal('delete-tag')
            break

          default:
            break
        }
      }
    }
  }, [fetcher.state, fetcher.data])

  const addTag = useCallback(() => {
    openModal('modify-tag', {})
  }, [openModal])

  const editTag = useCallback(
    (t: Tag) => {
      openModal('modify-tag', { ...t })
    },
    [navigate]
  )

  const openDeleteModal = useCallback(
    (id: string) => {
      openModal('delete-tag', { id })
    },
    [openModal]
  )

  const handleModifyTag = useCallback(
    (tagId: string | undefined, data: ModifyTag) => {
      if (tagId) {
        fetcher.submit(
          { action: ResourceAction.EDIT_TAG, id: tagId, ...data },
          {
            method: 'POST',
            encType: 'application/json',
          }
        )
      } else {
        fetcher.submit(
          { action: ResourceAction.ADD_TAG, ...data },
          {
            method: 'POST',
            encType: 'application/json',
          }
        )
      }
    },
    [fetcher]
  )

  const handleDeleteTag = useCallback(
    (tagId: string) => {
      fetcher.submit(
        { action: ResourceAction.DELETE_TAG, id: tagId },
        {
          method: 'DELETE',
          encType: 'application/json',
        }
      )
    },
    [fetcher]
  )

  // Columns for the DataTable
  const columns: ColumnDef<Tag>[] = useMemo(
    () => [
      ...tagColumns,
      {
        id: 'actions',
        cell: ({ row }) => (
          <ActionDropdown
            onEdit={() => editTag(row)}
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
        <PageTitle title={LABELS.TAGS} />

        {/* Table Header */}
        <TableHeaderSection>
          <SearchField
            name={NAMES.SEARCH_TAGS}
            placeholder={PLACEHOLDERS.SEARCH_TAGS}
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
              onClick={addTag}
            />
          </div>
        </TableHeaderSection>

        {/* Table */}
        <DataTable
          columns={columns}
          data={tags}
        />

        <Separator />

        {/* Table Footer */}
        <TableFooterSection
          page={page}
          onPageChange={handlePageChange}
          pageSize={VALUES.TAGS_PAGE_SIZE}
          dataCount={tags.length}
          totalCount={totalCount}
        />
      </div>

      <ModifyTagModal
        onClose={closeModifyTagModal}
        onModify={handleModifyTag}
      />
      <DeleteTagModal onDelete={handleDeleteTag} />
    </>
  )
}
