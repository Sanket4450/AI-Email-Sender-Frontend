import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import moment from 'moment'
import { ERROR_MSG } from './messages'
import { VALUES } from './values'
import { Response } from '~/types/common'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  date: string | Date,
  format: string = VALUES.COMMON_DATE_FORMAT
) {
  return moment(date).format(format)
}

export function normalizeString(str: string) {
  return str.trim().replace(/\s+/g, ' ')
}

export function normalizeCredential(str: string) {
  return str.replace(/\s+/g, '').toLowerCase()
}

export async function safeExecute(fn: () => Promise<Response>): Promise<Response> {
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
