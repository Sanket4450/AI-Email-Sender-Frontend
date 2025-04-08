import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import axios from 'axios'
import { addCompany } from '~/api/companies'
import { useFetcher, useNavigate } from '@remix-run/react'
import {
  ComposeEmail,
  ComposeEmailSchema,
  GenerateEmail,
  GenerateEmailSchema,
} from '~/schemas/email'
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
import { CONSTANTS, REQ_METHODS } from '~/lib/constants'
import { FormActionWrapper } from '~/components/shared/ui/form-action-wrapper'
import { Card, CardContent, CardFooter, CardHeader } from '~/components/ui/card'
import { Clock, Save, Send } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { ComposeEmailFields } from '~/components/emails/compose-email-fields'
import { Form } from '~/components/ui/form'
import { Label } from '~/components/ui/label'
import { Contact } from '~/types/contact'
import { fetchContacts } from '~/api/contacts'
import { CommonMultiSelectMenu } from '~/components/shared/form/common-multi-select-menu'
import { fetchSenders } from '~/api/senders'
import { Sender } from '~/types/sender'
import { CommonSelectMenu } from '~/components/shared/form/common-select-menu'
import { GenerateEmailFields } from '~/components/emails/generate-email-fields'
// import { baseURL } from '~/api'

const baseUrl = import.meta.env.VITE_BACKEND_URL

interface AddCompanyRequest extends Filter {
  action: ResourceAction
}

export async function action({
  request,
}: {
  request: Request
}): Promise<Response | null> {
  const { action, search, page, ...data }: AddCompanyRequest =
    await request.json()

  const fetchContactsData = async () => {
    const { count, data } = await fetchContacts({
      search,
      page,
    })

    return { count, data }
  }

  const fetchTagsData = async () => {
    const { count, data } = await fetchTags({
      search,
      page,
    })

    return { count, data }
  }

  const fetchSendersData = async () => {
    const { count, data } = await fetchSenders({
      search,
    })

    return { count, data }
  }

  switch (action) {
    case ResourceAction.CONTACTS_REFETCH:
      return {
        success: true,
        action: ResourceAction.CONTACTS_REFETCH,
        message: SUCCESS_MSG.CONTACTS_FETCHED,
        result: await fetchContactsData(),
      }

    case ResourceAction.TAGS_REFETCH:
      return {
        success: true,
        action: ResourceAction.TAGS_REFETCH,
        message: SUCCESS_MSG.TAGS_FETCHED,
        result: await fetchTagsData(),
      }

    case ResourceAction.SENDERS_REFETCH:
      return {
        success: true,
        action: ResourceAction.SENDERS_REFETCH,
        message: SUCCESS_MSG.SENDERS_FETCHED,
        result: await fetchSendersData(),
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
  const tagsFetcher = useFetcher<Response>()
  const sendersFetcher = useFetcher<Response>()
  const generateEmailFetcher = useFetcher<Response>()

  // Local States
  const [contacts, setContacts] = useState<Contact[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [senders, setSenders] = useState<Sender[]>([])

  const [totalContactsCount, setTotalContactsCount] = useState(0)
  const [totalTagsCount, setTotalTagsCount] = useState(0)
  const [totalSendersCount, setTotalSendersCount] = useState(0)

  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedSender, setSelectedSender] = useState<string | null>(null)

  const [content, setContent] = useState('')
  const [generatingResponse, setGeneratingResponse] = useState(false)
  const [generatedResponse, setGeneratedResponse] = useState('')
  const navigate = useNavigate()

  const contactOptions: SelectOption[] = useMemo(
    () => contacts.map((c) => ({ ...c, value: c.id, label: c.name })),
    [contacts]
  )

  const tagOptions: SelectOption[] = useMemo(
    () => tags.map((t) => ({ value: t.id, label: t.title })),
    [tags]
  )

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        const { action } = fetcher.data

        switch (action) {
          case ResourceAction.CONTACTS_REFETCH:
            setContacts(fetcher.data.result.data)
            setTotalContactsCount(fetcher.data.result.count)
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
    if (tagsFetcher.data) {
      if (tagsFetcher.data.success) {
        setTags(tagsFetcher.data.result.data)
        setTotalTagsCount(tagsFetcher.data.result.count)
      } else {
        toast.error(tagsFetcher.data.message)
      }
    }
  }, [tagsFetcher.data])

  useEffect(() => {
    if (sendersFetcher.data) {
      if (sendersFetcher.data.success) {
        setSenders(sendersFetcher.data.result.data)
        setTotalSendersCount(sendersFetcher.data.result.count)
      } else {
        toast.error(sendersFetcher.data.message)
      }
    }
  }, [sendersFetcher.data])

  useEffect(() => {
    fetcher.submit(
      { action: ResourceAction.CONTACTS_REFETCH },
      { method: 'POST', encType: 'application/json' }
    )
    tagsFetcher.submit(
      { action: ResourceAction.TAGS_REFETCH },
      { method: 'POST', encType: 'application/json' }
    )
    sendersFetcher.submit(
      { action: ResourceAction.SENDERS_REFETCH },
      { method: 'POST', encType: 'application/json' }
    )
  }, [])

  const generateeEmailForm = useForm<GenerateEmail>({
    resolver: zodResolver(GenerateEmailSchema),
    defaultValues: {
      prompt: '',
    },
  })

  const composeEmailForm = useForm<ComposeEmail>({
    resolver: zodResolver(ComposeEmailSchema),
    defaultValues: {
      subject: '',
    },
  })

  const validateGenerateEmailForm = async () => {
    return generateeEmailForm.trigger()
  }

  const validateComposeEmailForm = async () => {
    return composeEmailForm.trigger()
  }

  const handleGenerateEmail = async () => {
    if (await validateGenerateEmailForm()) {
      const values = generateeEmailForm.getValues()

      try {
        setGeneratingResponse(true)
        setGeneratedResponse('')

        const response = await axios.request({
          url: `${baseUrl}/api/ai/generate/email`,
          method: REQ_METHODS.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(values),
          responseType: 'stream',
          onDownloadProgress: (progressEvent) => {
            const chunk = progressEvent.event.target.response
            console.log(chunk)
            setContent((prevContent) => prevContent + chunk)
          },
        })

        console.log('final response ---------------->', response.data)
      } catch (error) {
        console.log('error occured on generate email', error)
      } finally {
        setGeneratingResponse(false)
      }
    }
  }

  const handleSaveDraft = async () => {
    if (await validateComposeEmailForm()) {
      const values = composeEmailForm.getValues()

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
    if (await validateComposeEmailForm()) {
      const values = composeEmailForm.getValues()

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
    if (await validateComposeEmailForm()) {
      const values = composeEmailForm.getValues()

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

      <main className="flex-1 min-h-0 flex gap-4">
        {/* Left (Info) Section */}
        <Card className="w-[40%] h-full flex flex-col">
          <CardContent className="flex-1 min-h-0 flex flex-col gap-y-3 p-5 py-4">
            {/* Select Contacts */}
            <CommonMultiSelectMenu
              data={contactOptions}
              selectedOptions={selectedContacts}
              label={LABELS.CONTACTS}
              placeholder={PLACEHOLDERS.CONTACTS}
              onChange={setSelectedContacts}
              readOnly={fetcher.state === 'loading'}
            />

            {/* Select Tags */}
            <CommonMultiSelectMenu
              data={tagOptions}
              selectedOptions={selectedTags}
              label={LABELS.TAGS}
              placeholder={PLACEHOLDERS.TAGS}
              onChange={setSelectedTags}
              readOnly={tagsFetcher.state === 'loading'}
            />

            {/* Select Sender */}
            <CommonSelectMenu
              data={tagOptions}
              selectedOption={selectedSender}
              label={LABELS.SENDER}
              placeholder={PLACEHOLDERS.SENDER}
              onChange={setSelectedSender}
              readOnly={sendersFetcher.state === 'loading'}
            />

            {/* Form */}
            <Form {...generateeEmailForm}>
              <form
                id={CONSTANTS.GENERATE_EMAIL_FORM}
                className="flex-1 min-h-0">
                <GenerateEmailFields control={generateeEmailForm.control} />
              </form>
            </Form>
          </CardContent>

          <CardFooter>
            <ActionBtn
              isLoading={generatingResponse}
              child={LABELS.GENERATE_EMAIL}
              onClick={handleGenerateEmail}
            />
          </CardFooter>
        </Card>

        {/* Right (Preview) Section */}
        <Card className="flex-1 h-full flex flex-col">
          <CardContent className="flex-1 min-h-0 flex flex-col gap-y-3 p-5 py-4">
            {/* Compose Email Form */}
            <Form {...composeEmailForm}>
              <form id={CONSTANTS.COMPOSE_EMAIL_FORM}>
                <ComposeEmailFields control={composeEmailForm.control} />
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
