import axios from 'axios'
import { REQ_METHODS } from '~/lib/constants'

const baseURL = process.env.VITE_BACKEND_URL

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
  try {
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
      throw new Error(data)
    }

    return data
  } catch (error: any) {
    console.error(`API Error: ${error}`)
    throw new Error(error)
  }
}
