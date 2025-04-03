import { Pagination, Search } from '~/types/common'
import { apiCall } from '.'
import { VALUES } from '~/lib/values'
import { DEFAULT_DATA_RESPONSE, REQ_METHODS } from '~/lib/constants'

interface FetchContacts extends Search, Pagination {}

export async function fetchContacts({ search, page = 1 }: FetchContacts) {
  try {
    const body = {
      ...(search && { search }),
      page: String(page),
      limit: String(VALUES.CONTACTS_PAGE_SIZE),
    }
    const { result } = await apiCall({
      url: 'contacts/get',
      method: REQ_METHODS.POST,
      body,
    })

    return result
  } catch (error) {
    return DEFAULT_DATA_RESPONSE
  }
}

export async function fetchSingleContact(id: string) {
  const { result } = await apiCall({
    url: `contacts/${id}`,
    method: REQ_METHODS.GET,
  })

  return result
}

export async function addContact(data: any) {
  const { result } = await apiCall({
    url: `contacts`,
    method: REQ_METHODS.POST,
    body: data,
  })

  return result
}

export async function updateContact(id: string, data: any) {
  const { result } = await apiCall({
    url: `contacts/${id}`,
    method: REQ_METHODS.PATCH,
    body: data,
  })

  return result
}

export async function deleteContact(id: string) {
  const { result } = await apiCall({
    url: `contacts/${id}`,
    method: REQ_METHODS.DELETE,
  })

  return result
}
