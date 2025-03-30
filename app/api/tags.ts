import { Pagination, Search } from '~/types/common'
import { apiCall } from '.'
import { VALUES } from '~/lib/values'
import { DEFAULT_DATA_RESPONSE, REQ_METHODS } from '~/lib/constants'

interface FetchTags extends Search, Pagination {}

export async function fetchTags({ search, page = 1 }: FetchTags) {
  try {
    const params = {
      ...(search && { search }),
      page: String(page),
      limit: String(VALUES.TAGS_PAGE_SIZE),
    }
    const { result } = await apiCall({
      url: 'tags',
      method: REQ_METHODS.GET,
      params,
    })

    return result
  } catch (error) {
    return DEFAULT_DATA_RESPONSE
  }
}

export async function addTag(data: any) {
  const { result } = await apiCall({
    url: `tags`,
    method: REQ_METHODS.POST,
    body: data,
  })

  return result
}

export async function updateTag(id: string, data: any) {
  const { result } = await apiCall({
    url: `tags/${id}`,
    method: REQ_METHODS.PATCH,
    body: data,
  })

  return result
}

export async function deleteTag(id: string) {
  const { result } = await apiCall({
    url: `tags/${id}`,
    method: REQ_METHODS.DELETE,
  })

  return result
}
