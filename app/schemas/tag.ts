import { z } from 'zod'
import { str_required } from './common'

export const ModifyTagSchema = z.object({
  title: str_required.min(1, {
    message: 'Tag Name is required.',
  }),
})

export type ModifyTag = z.infer<typeof ModifyTagSchema>
