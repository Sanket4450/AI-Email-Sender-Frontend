import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import moment from 'moment'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, format: string = 'DD-MM-YYYY') {
  return moment(date).format(format)
}

export function normalizeString(str: string) {
  return str.trim().replace(/\s+/g, ' ')
}

export function normalizeCredential(str: string) {
  return str.replace(/\s+/g, '').toLowerCase()
}
