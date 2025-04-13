import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import axios from 'axios'
import { Form } from '~/components/ui/form'
import { fetchContacts } from '~/api/contacts'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { LABELS, PLACEHOLDERS } from '~/lib/form'
import { CONSTANTS, REQ_METHODS } from '~/lib/constants'
import { formatEditorContent, getBaseURL, safeExecute } from '~/lib/utils'
import { ERROR_MSG, SUCCESS_MSG } from '~/lib/messages'
import { Filter, ResourceAction, Response, SelectOption } from '~/types/common'
import { fetchTags } from '~/api/tags'
import { Tag } from '~/types/tag'
import { CommonMultiSelectMenu } from '~/components/shared/form/common-multi-select-menu'
import { ActionBtn, CancelBtn } from '~/components/shared/ui/buttons'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { Contact } from '~/types/contact'
import { FormActionWrapper } from '~/components/shared/ui/form-action-wrapper'
import { Button } from '~/components/ui/button'
import { Clock, Save, Send, WandSparkles } from 'lucide-react'
import { Card, CardContent, CardFooter } from '~/components/ui/card'
import { CommonSelectMenu } from '~/components/shared/form/common-select-menu'
import { Label } from '~/components/ui/label'
import { RichEditor } from '~/components/shared/rich-text-editor'
import { fetchSingleDraft, updateDraft } from '~/api/drafts'
import { fetchSenders } from '~/api/senders'
import { addEmail } from '~/api/emails'
import { Sender } from '~/types/sender'
import { VALUES } from '~/lib/values'
import {
  ComposeEmail,
  ComposeEmailSchema,
  GenerateEmail,
  GenerateEmailSchema,
} from '~/schemas/email'
import { Draft } from '~/types/draft'
import { GenerateEmailFields } from '~/components/emails/generate-email-fields'
import { ComposeEmailFields } from '~/components/emails/compose-email-fields'

const baseURL = getBaseURL()

interface EditDraftRequest extends Filter {
  action: ResourceAction
}

export async function loader({ params }: LoaderFunctionArgs): Promise<Draft> {
  const result = await fetchSingleDraft(params.id as string)
  return result
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<Response | null> {
  const { action, search, page, ...data }: EditDraftRequest =
    await request.json()

  const draftId = params.id as string

  const fetchContactsData = async () => {
    const { count, data } = await fetchContacts({
      search,
      page,
    })

    return { count, data }
  }

  const fetchTagsData = async () => {
    const { count, data } = await fetchTags({
      asOptions: true,
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

    case ResourceAction.EDIT_DRAFT:
      return await safeExecute(async () => {
        await updateDraft(draftId, data)
        return {
          success: true,
          action: ResourceAction.EDIT_DRAFT,
          message: SUCCESS_MSG.EMAIL_SAVED,
        }
      })

    case ResourceAction.SCHEDULE_EMAIL:
      return await safeExecute(async () => {
        await updateDraft(draftId, data)
        return {
          success: true,
          action: ResourceAction.SCHEDULE_EMAIL,
          message: SUCCESS_MSG.EMAIL_SCHEDULED,
        }
      })

    case ResourceAction.SEND_EMAIL:
      return await safeExecute(async () => {
        await addEmail(data)
        return {
          success: true,
          action: ResourceAction.SEND_EMAIL,
          message: SUCCESS_MSG.EMAIL_SENT,
        }
      })

    default:
      return null
  }
}

export default function EditContactPage() {
  const loaderData = useLoaderData<typeof loader>()

  const fetcher = useFetcher<Response>()
  const contactsFetcher = useFetcher<Response>()
  const tagsFetcher = useFetcher<Response>()
  const sendersFetcher = useFetcher<Response>()

  // Local States
  const [contacts, setContacts] = useState<Contact[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [senders, setSenders] = useState<Sender[]>([])

  const [totalContactCount, setTotalContactCount] = useState(0)
  const [totalTagCount, setTotalTagCount] = useState(0)
  const [totalSenderCount, setTotalSenderCount] = useState(0)

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

  const senderOptions: SelectOption[] = useMemo(
    () => senders.map((t) => ({ value: t.id, label: t.displayName })),
    [senders]
  )

  useEffect(() => {
    if (loaderData) {
      const draft = loaderData

      if (draft.subject) composeEmailForm.setValue('subject', draft.subject)
      if (draft.body) setContent(draft.body)
      if (draft.sender) setSelectedSender(draft.sender.id)
      if (draft.contacts.length)
        setSelectedContacts(draft.contacts.map((c) => c.id))
      if (draft.tags.length) setSelectedTags(draft.tags.map((t) => t.id))
    }
  }, [loaderData])

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        const { action } = fetcher.data

        switch (action) {
          case ResourceAction.EDIT_DRAFT:
            toast.success(SUCCESS_MSG.EMAIL_SAVED)
            navigate('/drafts')
            break

          case ResourceAction.SCHEDULE_EMAIL:
            toast.success(SUCCESS_MSG.EMAIL_SCHEDULED)
            navigate('/drafts')
            break

          case ResourceAction.SEND_EMAIL:
            toast.success(SUCCESS_MSG.EMAIL_SENT)
            navigate('/emails')
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
    if (contactsFetcher.data) {
      if (contactsFetcher.data.success) {
        setContacts(contactsFetcher.data.result.data)
        setTotalContactCount(contactsFetcher.data.result.count)
      } else {
        toast.error(contactsFetcher.data.message)
      }
    }
  }, [contactsFetcher.data])

  useEffect(() => {
    if (tagsFetcher.data) {
      if (tagsFetcher.data.success) {
        setTags(tagsFetcher.data.result.data)
        setTotalTagCount(tagsFetcher.data.result.count)
      } else {
        toast.error(tagsFetcher.data.message)
      }
    }
  }, [tagsFetcher.data])

  useEffect(() => {
    if (sendersFetcher.data) {
      if (sendersFetcher.data.success) {
        setSenders(sendersFetcher.data.result.data)
        setTotalSenderCount(sendersFetcher.data.result.count)
      } else {
        toast.error(sendersFetcher.data.message)
      }
    }
  }, [sendersFetcher.data])

  useEffect(() => {
    contactsFetcher.submit(
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

  useEffect(() => {
    processEmailResponse(generatedResponse)
  }, [generatedResponse])

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

  const validateGenerateEmailForm = () => {
    return generateeEmailForm.trigger()
  }

  const validateComposeEmailForm = () => {
    return composeEmailForm.trigger()
  }

  const validateEmailPayload = () => {
    if (!content) {
      toast.error(ERROR_MSG.EMAIL_BODY_NOT_EMPTY)
      return false
    }
    if (!selectedContacts.length) {
      toast.error(ERROR_MSG.SELECT_CONTACTS)
      return false
    }
    if (!selectedSender) {
      toast.error(ERROR_MSG.SELECT_SENDER)
      return false
    }

    return true
  }

  const processEmailResponse = (response: string) => {
    if (response.includes(VALUES.SUBJECT_IDENFIFIER)) {
      let subject = response.split(VALUES.SUBJECT_IDENFIFIER)[1].trim()

      const bodyIndex = subject.indexOf(VALUES.BODY_IDENFIFIER)
      if (bodyIndex !== -1) {
        subject = subject.substring(0, bodyIndex).trim()

        const body = response.split(VALUES.BODY_IDENFIFIER)[1].trim()
        setContent(body)
      }
      composeEmailForm.setValue('subject', subject)
    } else {
      composeEmailForm.setValue('subject', '')
      setContent('')
    }
  }

  const handleGenerateEmail = async () => {
    if (await validateGenerateEmailForm()) {
      const values = generateeEmailForm.getValues()

      try {
        setGeneratingResponse(true)
        setGeneratedResponse('')

        const response = await axios.request({
          url: `${baseURL}/api/ai/generate/email`,
          method: REQ_METHODS.POST,
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify(values),
          responseType: 'stream',
          onDownloadProgress: (progressEvent) => {
            const chunk = progressEvent.event.target.response
            if (chunk) setGeneratedResponse((prev) => (prev += chunk))
          },
        })

        setGeneratedResponse(response.data)
      } catch (error: any) {
        toast.error(error.data?.message || error.message)
      } finally {
        setGeneratingResponse(false)
      }
    }
  }

  const abortGeneratingEmail = () => {
    setGeneratingResponse(false)
    setGeneratedResponse('')
  }

  const handleCancel = () => {
    navigate(-1)
  }

  const getPayload = () => {
    const values = composeEmailForm.getValues()

    const payload: any = {
      ...values,
    }

    if (content) {
      payload.body = formatEditorContent(content)
    }
    if (selectedContacts.length) {
      payload.contactIds = selectedContacts
    }
    if (selectedSender) {
      payload.senderId = selectedSender
    }
    if (selectedTags.length) {
      payload.tags = selectedTags
    }

    return payload
  }

  const handleSaveDraft = async () => {
    if (await validateComposeEmailForm()) {
      const payload = getPayload()

      fetcher.submit(
        {
          action: ResourceAction.EDIT_DRAFT,
          ...payload,
        },
        { method: 'POST', encType: 'application/json' }
      )
    }
  }

  const handleScheduleEmail = async () => {
    if ((await validateComposeEmailForm()) && validateEmailPayload()) {
      const payload = getPayload()

      fetcher.submit(
        {
          action: ResourceAction.SCHEDULE_EMAIL,
          ...payload,
        },
        { method: 'POST', encType: 'application/json' }
      )
    }
  }

  const handleSendEmail = async () => {
    if ((await validateComposeEmailForm()) && validateEmailPayload()) {
      const payload = getPayload()

      fetcher.submit(
        {
          action: ResourceAction.SEND_EMAIL,
          ...payload,
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
          <CancelBtn onClick={handleCancel} />

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
              readOnly={contactsFetcher.state === 'loading'}
            />

            {/* Select Sender */}
            <CommonSelectMenu
              data={senderOptions}
              selectedOption={selectedSender}
              label={LABELS.SENDER}
              placeholder={PLACEHOLDERS.SENDER}
              onChange={setSelectedSender}
              readOnly={sendersFetcher.state === 'loading'}
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

            {/* Form */}
            <Form {...generateeEmailForm}>
              <form
                id={CONSTANTS.GENERATE_EMAIL_FORM}
                className="flex-1 min-h-0">
                <GenerateEmailFields control={generateeEmailForm.control} />
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex items-center gap-3">
            {generatingResponse && <CancelBtn onClick={abortGeneratingEmail} />}

            <ActionBtn
              isLoading={generatingResponse}
              child={
                <div className="flex items-center gap-2">
                  <WandSparkles /> {LABELS.GENERATE_EMAIL}
                </div>
              }
              onClick={handleGenerateEmail}
            />
          </CardFooter>
        </Card>

        {/* Right (Preview) Section */}
        <Card className="flex-1 min-h-0 h-full flex flex-col">
          <CardContent className="flex-1 min-h-0 flex flex-col gap-y-3 p-5 py-4">
            {/* Compose Email Form */}
            <Form {...composeEmailForm}>
              <form id={CONSTANTS.COMPOSE_EMAIL_FORM}>
                <ComposeEmailFields control={composeEmailForm.control} />
              </form>
            </Form>

            <Label className="w-full">{LABELS.BODY}</Label>
            <div className="flex-1 min-h-0">
              <RichEditor
                placeholder={PLACEHOLDERS.EMAIL_BODY}
                initialValue={content}
                onChange={setContent}
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
