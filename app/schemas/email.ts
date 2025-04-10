import { z } from 'zod'
import { str_required } from './common'

export const GenerateEmailSchema = z.object({
  prompt: str_required.min(1, { message: 'Prompt is required.' }),
})

export type GenerateEmail = z.infer<typeof GenerateEmailSchema>

export const ComposeEmailSchema = z.object({
  subject: str_required.min(1, { message: 'Subject is required.' }),
})

export type ComposeEmail = z.infer<typeof ComposeEmailSchema>
