import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form } from '~/components/ui/form'
import { addSender } from '~/api/senders'
import { useFetcher, useNavigate } from '@remix-run/react'
import { CreateSender, CreateSenderSchema } from '~/schemas/sender'
import { LABELS, PLACEHOLDERS } from '~/lib/form'
import { CONSTANTS } from '~/lib/constants'
import { PageTitle } from '~/components/layout/page-title'
import { Sender } from '~/types/sender'
import { safeExecute } from '~/lib/utils'
import { ERROR_MSG, SUCCESS_MSG } from '~/lib/messages'
import { Filter, ResourceAction, Response } from '~/types/common'
import { SubmitBtn } from '~/components/shared/ui/buttons'
import { ModifySenderFields } from '~/components/senders/modify-sender-fields'
import { VALUES } from '~/lib/values'
import { CommonSelectMenu } from '~/components/shared/form/common-select-menu'
import { ESP_OPTIONS } from '~/lib/data'
import { ActionFunctionArgs } from '@remix-run/node'

interface AddSenderRequest extends Sender, Filter {
  action: ResourceAction
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<Response | null> {
  const { action, search, page, ...data }: AddSenderRequest =
    await request.json()

  switch (action) {
    case ResourceAction.ADD_SENDER:
      return await safeExecute(async () => {
        await addSender(data)
        return {
          success: true,
          action: ResourceAction.ADD_SENDER,
          message: SUCCESS_MSG.SENDER_ADDED,
        }
      })

    default:
      return null
  }
}

export default function AddSenderPage() {
  const fetcher = useFetcher<Response>()

  const [selectedESP, setSelectedESP] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        const { action } = fetcher.data

        switch (action) {
          case ResourceAction.ADD_SENDER:
            toast.success(SUCCESS_MSG.SENDER_ADDED)
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

  // Initialize the form with react-hook-form and Zod validation
  const form = useForm<CreateSender>({
    resolver: zodResolver(CreateSenderSchema),
    defaultValues: {
      displayName: '',
      name: '',
      apiKey: '',
      priority: VALUES.DEFAULT_PRIORITY.toString(),
      target: VALUES.DEFAULT_TARGET.toString(),
    },
  })

  const handleSubmit = (values: CreateSender) => {
    if (!selectedESP) {
      return toast.error(ERROR_MSG.ESP_NOT_SELECTED)
    }

    fetcher.submit(
      {
        action: ResourceAction.ADD_SENDER,
        ...values,
        priority: parseInt(values.priority),
        target: parseInt(values.target),
        esp: selectedESP,
      },
      { method: 'POST', encType: 'application/json' }
    )
  }

  return (
    <div className="container mx-auto max-w-3xl">
      {/* Header */}
      <PageTitle title={LABELS.ADD_NEW_SENDER} />

      {/* Form */}
      <Form {...form}>
        <form
          id={CONSTANTS.MODIFY_SENDER_FORM}
          onSubmit={form.handleSubmit(handleSubmit)}>
          <ModifySenderFields
            control={form.control}
            furtherFields={
              <CommonSelectMenu
                data={ESP_OPTIONS}
                label={LABELS.PROVIDER}
                placeholder={PLACEHOLDERS.PROVIDER}
                selectedOption={selectedESP}
                onChange={setSelectedESP}
                readOnly={fetcher.state === 'loading'}
              />
            }
          />
        </form>
      </Form>

      {/* Submit Button */}
      <SubmitBtn
        name={CONSTANTS.MODIFY_SENDER_FORM}
        child={LABELS.SAVE}
        className="w-full mt-8"
      />
    </div>
  )
}
