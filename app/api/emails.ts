import { Pagination, Search } from '~/types/common'
import { apiCall } from '.'
import { VALUES } from '~/lib/values'
import { DEFAULT_DATA_RESPONSE, REQ_METHODS } from '~/lib/constants'

interface FetchEmails extends Search, Pagination {}

export async function fetchEmails({ search, page = 1 }: FetchEmails) {
  try {
    const body = {
      ...(search && { search }),
      page: String(page),
      limit: String(VALUES.EMAILS_PAGE_SIZE),
    }
    const { result } = await apiCall({
      url: 'emails/get',
      method: REQ_METHODS.POST,
      body,
    })

    return result
  } catch (error) {
    return DEFAULT_DATA_RESPONSE
  }
}

export async function fetchSingleEmail(id: string) {
  const { result } = await apiCall({
    url: `emails/${id}`,
    method: REQ_METHODS.GET,
  })

  return result
}

export async function addEmail(data: any) {
  const { result } = await apiCall({
    url: `emails`,
    method: REQ_METHODS.POST,
    body: data,
  })

  return result
}
