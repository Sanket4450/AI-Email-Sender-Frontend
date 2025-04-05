import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form } from '~/components/ui/form'
import { addContact } from '~/api/contacts'
import { useFetcher, useNavigate } from '@remix-run/react'
import { ModifyContact, ModifyContactSchema } from '~/schemas/contact'
import { LABELS, PLACEHOLDERS } from '~/lib/form'
import { CONSTANTS } from '~/lib/constants'
import { PageTitle } from '~/components/layout/page-title'
import { Contact } from '~/types/contact'
import { safeExecute } from '~/lib/utils'
import { SUCCESS_MSG } from '~/lib/messages'
import { Filter, ResourceAction, Response, SelectOption } from '~/types/common'
import { fetchTags } from '~/api/tags'
import { Tag } from '~/types/tag'
import { CommonMultiSelectMenu } from '~/components/shared/form/common-multi-select-menu'
import { SubmitBtn } from '~/components/shared/buttons'
import { ModifyContactFields } from '~/components/contacts/modify-contact-fields'

interface AddContactRequest extends Contact, Filter {
  action: ResourceAction
}

export async function action({
  request,
}: {
  request: Request
}): Promise<Response | null> {
  const { action, search, page, ...data }: AddContactRequest =
    await request.json()

  const fetchTagsData = async () => {
    const { count, data } = await fetchTags({
      search,
      page,
    })

    return { count, data }
  }

  switch (action) {
    case ResourceAction.TAGS_REFETCH:
      return {
        success: true,
        action: ResourceAction.TAGS_REFETCH,
        message: SUCCESS_MSG.TAGS_FETCHED,
        result: await fetchTagsData(),
      }

    case ResourceAction.ADD_CONTACT:
      return await safeExecute(async () => {
        await addContact(data)
        return {
          success: true,
          action: ResourceAction.ADD_CONTACT,
          message: SUCCESS_MSG.CONTACT_ADDED,
        }
      })

    default:
      return null
  }
}

export default function AddContactPage() {
  const fetcher = useFetcher<Response>()

  // Local States
  const [tags, setTags] = useState<Tag[]>([])
  const [totalCount, setTotalCount] = useState(0)

  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const navigate = useNavigate()

  const tagOptions: SelectOption[] = useMemo(
    () => tags.map((t) => ({ value: t.id, label: t.title })),
    [tags]
  )

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        const { action } = fetcher.data

        switch (action) {
          case ResourceAction.TAGS_REFETCH:
            setTags(fetcher.data.result.data)
            setTotalCount(fetcher.data.result.count)
            break

          case ResourceAction.ADD_CONTACT:
            toast.success(SUCCESS_MSG.CONTACT_ADDED)
            navigate(-1)
            break

          default:
            break
        }
      } else {
        toast.error(fetcher.data.message)
      }
    }
  }, [fetcher.data])

  useEffect(() => {
    fetcher.submit(
      { action: ResourceAction.TAGS_REFETCH },
      { method: 'POST', encType: 'application/json' }
    )
  }, [])

  // Initialize the form with react-hook-form and Zod validation
  const form = useForm<ModifyContact>({
    resolver: zodResolver(ModifyContactSchema),
    defaultValues: {
      name: '',
      position: '',
      email: '',
      phone: '',
      location: '',
      linkedInUrl: '',
    },
  })

  const handleSubmit = (values: ModifyContact) => {
    fetcher.submit(
      {
        action: ResourceAction.ADD_CONTACT,
        ...values,
        ...(selectedTags.length && { tags: selectedTags }),
      },
      { method: 'POST', encType: 'application/json' }
    )
  }

  return (
    <div className="container mx-auto max-w-3xl">
      {/* Header */}
      <PageTitle title={LABELS.ADD_NEW_CONTACT} />

      {/* Form */}
      <Form {...form}>
        <form
          id={CONSTANTS.MODIFY_CONTACT_FORM}
          onSubmit={form.handleSubmit(handleSubmit)}>
          <ModifyContactFields
            control={form.control}
            furtherFields={
              <CommonMultiSelectMenu
                data={tagOptions}
                label={LABELS.TAGS}
                placeholder={PLACEHOLDERS.TAGS}
                selectedOptions={selectedTags}
                onChange={setSelectedTags}
                readOnly={fetcher.state === 'loading'}
              />
            }
          />
        </form>
      </Form>

      {/* Submit Button */}
      <SubmitBtn
        name={CONSTANTS.MODIFY_CONTACT_FORM}
        child={LABELS.SAVE}
        className="w-full mt-8"
      />
    </div>
  )
}
