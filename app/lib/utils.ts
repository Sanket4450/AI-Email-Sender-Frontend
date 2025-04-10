import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import moment from 'moment'
import { ERROR_MSG } from './messages'
import { VALUES } from './values'
import { Response } from '~/types/common'
import { EmailEvent } from '~/types/email'
import { EMAIL_EVENTS } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  date: string | Date,
  format: string = VALUES.COMMON_DATE_FORMAT
) {
  date = typeof date === 'string' ? date + 'Z' : date
  return moment(date).format(format)
}

export function normalizeString(str: string) {
  return str.trim().replace(/\s+/g, ' ')
}

export function normalizeCredential(str: string) {
  return str.replace(/\s+/g, '').toLowerCase()
}

export const sanitizeObj = <T extends object>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_key, value]) => {
      return value !== undefined && value !== null && value !== ''
    })
  ) as Partial<T>
}

export async function safeExecute(
  fn: () => Promise<Response>
): Promise<Response> {
  try {
    const result = await fn()
    return result
  } catch (error: any) {
    return {
      success: false,
      message: error.message || ERROR_MSG.SOMETHING_WENT_WRONG,
    }
  }
}

export function formatStringArray<T>(data: T[], key: string) {
  return data.map((d) => d[key as keyof T]).join(', ')
}

export const formatEditorContent = (htmlStr: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlStr, 'text/html')

  const paragraphs = doc.querySelectorAll('p')

  paragraphs.forEach((p) => {
    const div = doc.createElement('div')
    div.innerHTML = p.innerHTML
    p.replaceWith(div)
  })

  return doc.body.innerHTML
}

export const prepareEmailEvents = (events: EmailEvent[]) => {
  const emailEvents: Record<
    (typeof EMAIL_EVENTS)[keyof typeof EMAIL_EVENTS],
    boolean
  > = {
    [EMAIL_EVENTS.processed]: false,
    [EMAIL_EVENTS.delivered]: false,
    [EMAIL_EVENTS.opened]: false,
    [EMAIL_EVENTS.clicked]: false,
  }

  Object.values(EMAIL_EVENTS).forEach((event) => {
    if (events.some((e) => e.eventType === event)) {
      emailEvents[event] = true
    }
  })

  return emailEvents
}
