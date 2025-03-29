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
