import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { addCompany } from '~/api/companies'
import { useFetcher, useNavigate } from '@remix-run/react'
import { ComposeEmail, ComposeEmailSchema } from '~/schemas/email'
import { LABELS, PLACEHOLDERS } from '~/lib/form'
import { PageTitle } from '~/components/layout/page-title'
import { Company } from '~/types/company'
import { safeExecute } from '~/lib/utils'
import { SUCCESS_MSG } from '~/lib/messages'
import { Filter, ResourceAction, Response, SelectOption } from '~/types/common'
import { fetchTags } from '~/api/tags'
import { Tag } from '~/types/tag'
import { ActionBtn, SubmitBtn } from '~/components/shared/ui/buttons'
import { RichEditor } from '~/components/shared/rich-text-editor'
import { CONSTANTS } from '~/lib/constants'
import { FormActionWrapper } from '~/components/shared/ui/form-action-wrapper'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Clock, Save, Send } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { ComposeEmailFields } from '~/components/emails/compose-email-fields'
import { Form } from '~/components/ui/form'
import { Label } from '~/components/ui/label'
import { Contact } from '~/types/contact'

interface AddCompanyRequest extends Company, Filter {
  action: ResourceAction
}

export async function action({
  request,
}: {
  request: Request
}): Promise<Response | null> {
  const { action, search, page, ...data }: AddCompanyRequest =
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

    case ResourceAction.ADD_COMPANY:
      return await safeExecute(async () => {
        await addCompany(data)
        return {
          success: true,
          action: ResourceAction.ADD_COMPANY,
          message: SUCCESS_MSG.COMPANY_ADDED,
        }
      })

    default:
      return null
  }
}

export default function AddCompanyPage() {
  const fetcher = useFetcher<Response>()

  // Local States
  const [contacts, setContacts] = useState<Contact[]>([])
  const [totalContactsCount, setTotalContactsCount] = useState(0)

  const [tags, setTags] = useState<Tag[]>([])
  const [totalTagsCount, setTotalTagsCount] = useState(0)

  const [selectedContacts, setSelectedContacts] = useState<SelectOption[]>([])
  const [content, setContent] = useState('')

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
            setTotalTagsCount(fetcher.data.result.count)
            break

          case ResourceAction.ADD_COMPANY:
            toast.success(SUCCESS_MSG.COMPANY_ADDED)
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
  const form = useForm<ComposeEmail>({
    resolver: zodResolver(ComposeEmailSchema),
    defaultValues: {
      subject: '',
    },
  })

  const validateForm = async () => {
    return form.trigger()
  }

  const handleSaveDraft = async () => {
    if (await validateForm()) {
      const values = form.getValues()

      fetcher.submit(
        {
          action: ResourceAction.ADD_COMPANY,
          ...values,
          ...(selectedTags.length && { tags: selectedTags }),
        },
        { method: 'POST', encType: 'application/json' }
      )
    }
  }

  const handleScheduleEmail = async () => {
    if (await validateForm()) {
      const values = form.getValues()

      fetcher.submit(
        {
          action: ResourceAction.ADD_COMPANY,
          ...values,
          ...(selectedTags.length && { tags: selectedTags }),
        },
        { method: 'POST', encType: 'application/json' }
      )
    }
  }

  const handleSendEmail = async () => {
    if (await validateForm()) {
      const values = form.getValues()

      fetcher.submit(
        {
          action: ResourceAction.ADD_COMPANY,
          ...values,
          ...(selectedTags.length && { tags: selectedTags }),
        },
        { method: 'POST', encType: 'application/json' }
      )
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-2 w-full pb-4">
        <h1 className="text-2xl font-bold">{LABELS.COMPOSE}</h1>
        <FormActionWrapper>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleSaveDraft}>
            <Save size={16} />
            <span>{LABELS.SAVE_DRAFT}</span>
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleScheduleEmail}>
            <Clock size={16} />
            <span>{LABELS.SCHEDULE}</span>
          </Button>

          <Button
            className="flex items-center gap-2 text-white hover:bg-primary-foreground"
            onClick={handleSendEmail}>
            <Send size={16} />
            <span>{LABELS.SEND_NOW}</span>
          </Button>
        </FormActionWrapper>
      </header>

      <main className="flex-1 min-h-0 flex">
        {/* Left (Info) Section */}
        <section className="w-[40%]"></section>

        {/* Right (Preview) Section */}
        <Card className="flex-1 h-full flex flex-col">
          <CardContent className="flex-1 min-h-0 flex flex-col gap-y-3 p-5 py-4">
            {/* Form */}
            <Form {...form}>
              <form
                id={CONSTANTS.COMPOSE_EMAIL_FORM}
                onSubmit={form.handleSubmit(() => {})}>
                <ComposeEmailFields control={form.control} />
              </form>
            </Form>

            <Label className="w-full">{LABELS.BODY}</Label>
            <RichEditor
              placeholder={PLACEHOLDERS.EMAIL_BODY}
              initialValue={content}
              onChange={setContent}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
