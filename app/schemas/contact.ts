import { z } from 'zod'
import { str, str_required } from './common'
import { REGEX } from '~/lib/constants'

export const ModifyContactSchema = z.object({
  name: str_required.min(1, { message: 'Name is required.' }),
  position: str_required.min(1, { message: 'Position is required.' }),
  email: str_required.min(1, { message: 'Email is required.' }).email({ message: 'Invalid email format.' }),
  phone: str.refine((value) => !value || REGEX.MOBILE.test(value), {
    message: 'Phone Number must be exactly 10 digits.',
  }),
  linkedInUrl: str.refine(
    (value) => !value || REGEX.LINKED_IN_URL.test(value),
    {
      message: 'Not a valid LinkedIn URL.',
    }
  ),
  location: str,
})

export type ModifyContact = z.infer<typeof ModifyContactSchema>
