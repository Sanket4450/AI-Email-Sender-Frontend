import { z } from 'zod'

export const ModifyCompanySchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  description: z.string().optional(),
  location: z
    .string()
    .min(3, { message: 'Location must be at least 3 characters.' }),
})

export type ModifyCompany = z.infer<typeof ModifyCompanySchema>
