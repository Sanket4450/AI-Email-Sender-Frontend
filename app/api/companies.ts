import { Pagination, Search } from '~/types/common'
import { apiCall } from '.'
import { VALUES } from '~/lib/values'
import { DEFAULT_DATA_RESPONSE, REQ_METHODS } from '~/lib/constants'

interface FetchCompanies extends Search, Pagination {}

export async function fetchCompanies({ search, page = 1 }: FetchCompanies) {
  try {
    const body = {
      ...(search && { search }),
      page: String(page),
      limit: String(VALUES.COMPANIES_PAGE_SIZE),
    }
    const { result } = await apiCall({
      url: 'companies/get',
      method: REQ_METHODS.POST,
      body,
    })

    return result
  } catch (error) {
    return DEFAULT_DATA_RESPONSE
  }
}

export async function fetchSingleCompany(id: string) {
  const { result } = await apiCall({
    url: `companies/${id}`,
    method: REQ_METHODS.GET,
  })

  return result
}

export async function addCompany(data: any) {
  const { result } = await apiCall({
    url: `companies`,
    method: REQ_METHODS.POST,
    body: data,
  })

  return result
}

export async function updateCompany(id: string, data: any) {
  const { result } = await apiCall({
    url: `companies/${id}`,
    method: REQ_METHODS.PATCH,
    body: data,
  })

  return result
}

export async function deleteCompany(id: string) {
  const { result } = await apiCall({
    url: `companies/${id}`,
    method: REQ_METHODS.DELETE,
  })

  return result
}
