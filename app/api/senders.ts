import {  Search } from '~/types/common'
import { apiCall } from '.'
import { DEFAULT_DATA_RESPONSE, REQ_METHODS } from '~/lib/constants'

interface FetchSenders extends Search {
  esps?: string[]
}

export async function fetchSenders({ search, esps = [] }: FetchSenders) {
  try {
    const body = {
      ...(search && { search }),
      esps,
    }
    const { result } = await apiCall({
      url: 'senders/get',
      method: REQ_METHODS.POST,
      body,
    })

    return result
  } catch (error) {
    return DEFAULT_DATA_RESPONSE
  }
}

export async function fetchESPs() {
  try {
    const { result } = await apiCall({
      url: 'senders/esps',
    })

    return result
  } catch (error) {
    return []
  }
}

export async function fetchSingleSender(id: string) {
  const { result } = await apiCall({
    url: `senders/${id}`,
    method: REQ_METHODS.GET,
  })

  return result
}

export async function addSender(data: any) {
  const { result } = await apiCall({
    url: `senders`,
    method: REQ_METHODS.POST,
    body: data,
  })

  return result
}

export async function updateSender(id: string, data: any) {
  const { result } = await apiCall({
    url: `senders/${id}`,
    method: REQ_METHODS.PATCH,
    body: data,
  })

  return result
}

export async function deleteSender(id: string) {
  const { result } = await apiCall({
    url: `senders/${id}`,
    method: REQ_METHODS.DELETE,
  })

  return result
}
