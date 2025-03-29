import { REQ_METHODS } from '~/lib/constants'
import { ERROR_MSG } from '~/lib/messages'

const baseUrl = process.env.BACKEND_URL

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
}: ApiCallProps) {
  const searchParams = new URLSearchParams(params).toString()

  const response = await fetch(`${baseUrl}/api/${url}?${searchParams}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(method !== REQ_METHODS.GET && { body: JSON.stringify(body) }),
  })

  const data = await response.json()

  if (!data?.success) {
    console.log(`Error calling API: ${data?.message}`)

    throw Response.json(
      { message: data?.message || ERROR_MSG.INTERNAL_SERVER_ERROR },
      { status: data?.statusCode || 500 }
    )
  }

  return data
}
