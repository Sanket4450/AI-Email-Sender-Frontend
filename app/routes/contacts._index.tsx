import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react'
import { deleteContact, fetchContacts } from '~/api//contacts'
import { DataTable } from '~/components/shared/table/data-table'
import { ColumnDef, ResourceAction, Response } from '~/types/common'
import { ActionDropdown } from '~/components/shared/table/action-dropdown'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useModal } from '~/context/modal-context'
import { Contact } from '~/types/contact'
import { LABELS, NAMES, PLACEHOLDERS } from '~/lib/form'
import { safeExecute } from '~/lib/utils'
import { SearchField } from '~/components/shared/form/search-field'
import { useDebouncedSearch } from '~/hooks/use-debounced-search'
import { Separator } from '~/components/ui/separator'
import { TableFooterSection } from '~/components/shared/table/table-footer-section'
import { VALUES } from '~/lib/values'
import { PageTitle } from '~/components/layout/page-title'
import { TableHeaderSection } from '~/components/shared/table/table-header-section'
import { DeleteContactModal } from '~/components/contacts/delete-contact-modal'
import { toast } from 'sonner'
import { SUCCESS_MSG } from '~/lib/messages'
import { LoaderFunctionArgs } from '@remix-run/node'
import { CONSTANTS } from '~/lib/constants'
import { ActionBtn, CancelBtn } from '~/components/shared/ui/buttons'
import { contactColumns } from '~/components/contacts/contact-columns'

interface ContactsRequest {
  action: ResourceAction
  search: string
  page: number
  id: string
}

interface ContactsResponse {
  count: number
  data: Contact[]
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<ContactsResponse> {
  const url = new URL(request.url)

  const search = url.searchParams.get(VALUES.SEARCH_QUERY_PARAM) || ''
  const page = parseInt(
    url.searchParams.get(VALUES.PAGE_QUERY_PARAM) || '1',
    10
  )
  const { count, data } = await fetchContacts({ search, page })

  return { count, data }
}

export async function action({
  request,
}: {
  request: Request
}): Promise<Response | null> {
  const { action, id }: ContactsRequest = await request.json()

  switch (action) {
    case ResourceAction.DELETE_CONTACT:
      return await safeExecute(async () => {
        await deleteContact(id)
        return {
          success: true,
          action: ResourceAction.DELETE_CONTACT,
          message: SUCCESS_MSG.CONTACT_DELETED,
        }
      })

    default:
      return null
  }
}

export default function ContactsPage() {
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
  const [contacts, setContacts] = useState<Contact[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchText, setSearchText] = useState(urlSearch)

  const navigate = useNavigate()

  const { search } = useDebouncedSearch(searchText)

  useEffect(() => {
    setContacts(loaderData.data)
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
          case ResourceAction.DELETE_CONTACT:
            toast.success(fetcher.data.message)
            closeModal('delete-contact')
            break

          default:
            break
        }
      }
    }
  }, [fetcher.state, fetcher.data])

  const navigateToAddContact = useCallback(() => {
    navigate('/contacts/add')
  }, [navigate])

  const navigateToEditContact = useCallback(
    (id: string) => {
      navigate(`/contacts/${id}/edit`)
    },
    [navigate]
  )

  const openDeleteModal = useCallback(
    (id: string) => {
      openModal('delete-contact', { id })
    },
    [openModal]
  )

  const handleDeleteContact = useCallback(
    (contactId: string) => {
      fetcher.submit(
        { action: ResourceAction.DELETE_CONTACT, id: contactId },
        {
          method: 'DELETE',
          encType: 'application/json',
        }
      )
    },
    [fetcher]
  )

  // Columns for the DataTable
  const columns: ColumnDef<Contact>[] = useMemo(
    () => [
      ...contactColumns,
      {
        id: 'actions',
        cell: ({ row }) => (
          <ActionDropdown
            onEdit={() => navigateToEditContact(row.id)}
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
        <PageTitle title={LABELS.CONTACTS} />

        {/* Table Header */}
        <TableHeaderSection>
          <SearchField
            name={NAMES.SEARCH_CONTACTS}
            placeholder={PLACEHOLDERS.SEARCH_CONTACTS}
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
              onClick={navigateToAddContact}
            />
          </div>
        </TableHeaderSection>

        {/* Table */}
        <DataTable
          columns={columns}
          data={contacts}
        />

        <Separator />

        {/* Table Footer */}
        <TableFooterSection
          page={page}
          onPageChange={handlePageChange}
          pageSize={VALUES.CONTACTS_PAGE_SIZE}
          dataCount={contacts.length}
          totalCount={totalCount}
        />
      </div>

      <DeleteContactModal onDelete={handleDeleteContact} />
    </>
  )
}
