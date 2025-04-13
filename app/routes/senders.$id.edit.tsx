import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form } from '~/components/ui/form'
import { fetchSingleSender, updateSender } from '~/api/senders'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { UpdateSender, UpdateSenderSchema } from '~/schemas/sender'
import { LABELS, PLACEHOLDERS } from '~/lib/form'
import { CONSTANTS } from '~/lib/constants'
import { Sender } from '~/types/sender'
import { safeExecute, sanitizeObj } from '~/lib/utils'
import { ERROR_MSG, SUCCESS_MSG } from '~/lib/messages'
import { Filter, ResourceAction, Response } from '~/types/common'
import { SubmitBtn } from '~/components/shared/ui/buttons'
import { ModifySenderFields } from '~/components/senders/modify-sender-fields'
import { VALUES } from '~/lib/values'
import { CommonSelectMenu } from '~/components/shared/form/common-select-menu'
import { ESP_OPTIONS } from '~/lib/data'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

interface EditSenderRequest extends Sender, Filter {
  action: ResourceAction
}

export const handle = {
  heading: LABELS.EDIT_SENDER,
}

export async function loader({ params }: LoaderFunctionArgs): Promise<Sender> {
  const result = await fetchSingleSender(params.id as string)
  return result
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<Response | null> {
  const { action, ...data }: EditSenderRequest = await request.json()

  switch (action) {
    case ResourceAction.EDIT_SENDER:
      return await safeExecute(async () => {
        await updateSender(params.id as string, data)
        return {
          success: true,
          action: ResourceAction.EDIT_SENDER,
          message: SUCCESS_MSG.SENDER_UPDATED,
        }
      })

    default:
      return null
  }
}

export default function EditSenderPage() {
  const loaderData = useLoaderData<typeof loader>()

  const fetcher = useFetcher<Response>()

  const [selectedESP, setSelectedESP] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.success) {
        const { action } = fetcher.data

        switch (action) {
          case ResourceAction.EDIT_SENDER:
            toast.success(fetcher.data.message)
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
    if (loaderData) {
      const sender = loaderData

      setSelectedESP(sender.esp)

      form.setValue('displayName', sender.displayName)
      form.setValue('name', sender.name)
      form.setValue('email', sender.email)
      form.setValue('priority', sender.priority.toString())
      form.setValue('target', sender.target.toString())
    }
  }, [loaderData])

  // Initialize the form with react-hook-form and Zod validation
  const form = useForm<UpdateSender>({
    resolver: zodResolver(UpdateSenderSchema),
    defaultValues: {
      displayName: '',
      name: '',
      apiKey: '',
      priority: VALUES.DEFAULT_PRIORITY.toString(),
      target: VALUES.DEFAULT_TARGET.toString(),
    },
  })

  const handleSubmit = (values: UpdateSender) => {
    const payload = sanitizeObj(values)

    if (!selectedESP) {
      return toast.error(ERROR_MSG.ESP_NOT_SELECTED)
    }

    fetcher.submit(
      {
        action: ResourceAction.EDIT_SENDER,
        ...payload,
        priority: parseInt(values.priority),
        target: parseInt(values.target),
        esp: selectedESP,
      },
      { method: 'POST', encType: 'application/json' }
    )
  }

  return (
    <div className="container mx-auto max-w-3xl">
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
