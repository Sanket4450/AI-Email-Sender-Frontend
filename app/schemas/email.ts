import { z } from 'zod'

export const ComposeEmailSchema = z.object({
  // recipients: z.string().min(1, { message: 'No recipients selected.' }),
  subject: z.string().min(1, { message: 'Subject is required.' }),
})

export type ComposeEmail = z.infer<typeof ComposeEmailSchema>
