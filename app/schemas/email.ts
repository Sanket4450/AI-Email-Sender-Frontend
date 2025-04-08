import { z } from 'zod'

export const GenerateEmailSchema = z.object({
  prompt: z.string().min(1, { message: 'Prompt is required.' }),
})

export type GenerateEmail = z.infer<typeof GenerateEmailSchema>

export const ComposeEmailSchema = z.object({
  subject: z.string().min(1, { message: 'Subject is required.' }),
})

export type ComposeEmail = z.infer<typeof ComposeEmailSchema>
