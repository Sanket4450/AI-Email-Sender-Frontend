import { z } from 'zod'
import { str, str_required } from './common'
import { REGEX } from '~/lib/constants'

export const CommonSenderSchema = z.object({
  displayName: str_required.min(1, {
    message: 'Display Name is required.',
  }),
  name: str_required.min(1, { message: 'Name is required.' }),
  email: str_required
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Invalid email format.' }),
  priority: str_required
    .min(1, {
      message: 'Priority is required.',
    })
    .refine((value) => REGEX.UNSIGNED_INT.test(value), {
      message: 'Priority must be a positive number.',
    }),
  target: str_required
    .min(1, {
      message: 'Target is required.',
    })
    .refine((value) => REGEX.UNSIGNED_INT.test(value), {
      message: 'Target must be a positive number.',
    }),
})

export const CreateSenderSchema = CommonSenderSchema.extend({
  apiKey: str_required.min(1, {
    message: 'API Key is required.',
  }),
})

export type CreateSender = z.infer<typeof CreateSenderSchema>

export const UpdateSenderSchema = CommonSenderSchema.extend({
  apiKey: str,
})

export type UpdateSender = z.infer<typeof UpdateSenderSchema>
