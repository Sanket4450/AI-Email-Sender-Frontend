import { Pagination, Search } from '~/types/common'
import { apiCall } from '.'
import { VALUES } from '~/lib/values'
import { DEFAULT_DATA_RESPONSE, REQ_METHODS } from '~/lib/constants'

interface FetchDrafts extends Search, Pagination {}

export async function fetchDrafts({ search, page = 1 }: FetchDrafts) {
  try {
    const body = {
      ...(search && { search }),
      page: String(page),
      limit: String(VALUES.DRAFTS_PAGE_SIZE),
    }
    const { result } = await apiCall({
      url: 'drafts/get',
      method: REQ_METHODS.POST,
      body,
    })

    return result
  } catch (error) {
    return DEFAULT_DATA_RESPONSE
  }
}

export async function fetchSingleDraft(id: string) {
  const { result } = await apiCall({
    url: `drafts/${id}`,
    method: REQ_METHODS.GET,
  })

  return result
}

export async function addDraft(data: any) {
  const { result } = await apiCall({
    url: `drafts`,
    method: REQ_METHODS.POST,
    body: data,
  })

  return result
}

export async function updateDraft(id: string, data: any) {
  const { result } = await apiCall({
    url: `drafts/${id}`,
    method: REQ_METHODS.PATCH,
    body: data,
  })

  return result
}

export async function deleteDraft(id: string) {
  const { result } = await apiCall({
    url: `drafts/${id}`,
    method: REQ_METHODS.DELETE,
  })

  return result
}
