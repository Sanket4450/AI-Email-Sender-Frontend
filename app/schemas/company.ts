import { z } from 'zod'
import { str, str_required } from './common'

export const ModifyCompanySchema = z.object({
  title: str_required.min(1, {
    message: 'Title is required.',
  }),
  description: str,
  location: str_required.min(1, {
    message: 'Location is required.',
  }),
})

export type ModifyCompany = z.infer<typeof ModifyCompanySchema>
