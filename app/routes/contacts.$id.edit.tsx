import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form } from '~/components/ui/form'
import { fetchSingleContact, updateContact } from '~/api/contacts'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { ModifyContact, ModifyContactSchema } from '~/schemas/contact'
import { LABELS, PLACEHOLDERS } from '~/lib/form'
import { CONSTANTS } from '~/lib/constants'
import { safeExecute, sanitizeObj } from '~/lib/utils'
import { SUCCESS_MSG } from '~/lib/messages'
import { Filter, ResourceAction, Response, SelectOption } from '~/types/common'
import { fetchTags } from '~/api/tags'
import { Tag } from '~/types/tag'
import { CommonMultiSelectMenu } from '~/components/shared/form/common-multi-select-menu'
import { CancelBtn, SubmitBtn } from '~/components/shared/ui/buttons'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Contact } from '~/types/contact'
import { ModifyContactFields } from '~/components/contacts/modify-contact-fields'
import { FormActionWrapper } from '~/components/shared/ui/form-action-wrapper'

export const handle = {
  heading: LABELS.EDIT_CONTACT,
}

interface EditContactRequest extends Filter {
  action: ResourceAction
}

export async function loader({ params }: LoaderFunctionArgs): Promise<Contact> {
  const result = await fetchSingleContact(params.id as string)
  return result
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<Response | null> {
  const { action, search, page, ...data }: EditContactRequest =
    await request.json()

  const fetchTagsData = async () => {
    const { count, data } = await fetchTags({
      asOptions: true,
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

    case ResourceAction.EDIT_CONTACT:
      return await safeExecute(async () => {
        await updateContact(params.id as string, data)
        return {
          success: true,
          action: ResourceAction.EDIT_CONTACT,
          message: SUCCESS_MSG.CONTACT_UPDATED,
        }
      })

    default:
      return null
  }
}

export default function EditContactPage() {
  const loaderData = useLoaderData<typeof loader>()

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
    if (loaderData) {
      const contact = loaderData

      setSelectedTags(contact.tags.map((t) => t.id))

      form.setValue('name', contact.name)
      form.setValue('position', contact.position)
      form.setValue('email', contact.email)
      if (contact.phone) form.setValue('phone', contact.phone)
      if (contact.linkedInUrl) form.setValue('linkedInUrl', contact.linkedInUrl)
      if (contact.location) form.setValue('location', contact.location)
    }
  }, [loaderData])

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        const { action } = fetcher.data

        switch (action) {
          case ResourceAction.TAGS_REFETCH:
            setTags(fetcher.data.result.data)
            setTotalCount(fetcher.data.result.count)
            break

          case ResourceAction.EDIT_CONTACT:
            toast.success(SUCCESS_MSG.CONTACT_UPDATED)
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

  const handleCancel = () => {
    navigate(-1)
  }

  const handleSubmit = (values: ModifyContact) => {
    const payload = sanitizeObj(values)

    fetcher.submit(
      {
        action: ResourceAction.EDIT_CONTACT,
        ...payload,
        ...(selectedTags.length && { tags: selectedTags }),
      },
      { method: 'POST', encType: 'application/json' }
    )
  }

  return (
    <div className="container mx-auto max-w-2xl">
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

      {/* Form Action */}
      <FormActionWrapper className="mt-8">
        <CancelBtn onClick={handleCancel} />
        <SubmitBtn
          name={CONSTANTS.MODIFY_CONTACT_FORM}
          child={LABELS.SAVE}
        />
      </FormActionWrapper>
    </div>
  )
}
