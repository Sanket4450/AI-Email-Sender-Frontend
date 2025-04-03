import axios from 'axios'
import { REQ_METHODS } from '~/lib/constants'
import { ERROR_MSG } from '~/lib/messages'

const baseURL = process.env.BACKEND_URL

interface ApiCallProps {
  url: string
  method?: (typeof REQ_METHODS)[keyof typeof REQ_METHODS]
  params?: Record<string, string>
  headers?: Record<string, string>
  body?: Record<string, any>
}

export async function apiCall({
  url,
  method = REQ_METHODS.GET,
  params = {},
  headers = {},
  body = {},
}: ApiCallProps): Promise<any> {
  const response = await axios.request({
    url: `${baseURL}/api/${url}`,
    method,
    params,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    data: method !== REQ_METHODS.GET ? JSON.stringify(body) : undefined,
  })

  const data = response.data

  if (!data?.success) {
    console.error(`API Error: ${data?.message}`)
    throw new Error(data?.message || ERROR_MSG.INTERNAL_SERVER_ERROR)
  }

  return data
}
