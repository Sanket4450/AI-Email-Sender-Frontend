import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form } from '~/components/ui/form'
import { Button } from '~/components/ui/button'
import { addCompany } from '~/api/companies'
import { useFetcher, useNavigate } from '@remix-run/react'
import { ModifyCompany, ModifyCompanySchema } from '~/schemas/company'
import { LABELS, PLACEHOLDERS } from '~/lib/form'
import { MODIFY_COMPANY_FIELDS } from '~/lib/form-fields'
import { CONSTANTS, INPUT_TYPES } from '~/lib/constants'
import { CommonTextarea } from '~/components/shared/form/common-textarea'
import { CommonTextField } from '~/components/shared/form/common-text-field'
import { PageTitle } from '~/components/layout/page-title'
import { Company, ResourceAction } from '~/types/company'
import { safeExecute } from '~/lib/utils'
import { SUCCESS_MSG } from '~/lib/messages'
import { Filter, SelectOptionRecord } from '~/types/common'
import { fetchTags } from '~/api/tags'
import { Tag } from '~/types/tag'
import { CommonMultiSelectMenu } from '~/components/shared/form/common-multi-select-menu'
import { SubmitBtn } from '~/components/shared/buttons'

interface AddCompanyRequest extends Company, Filter {
  action: ResourceAction
}

interface ActionResponse {
  action: ResourceAction
  error?: string
  tagsResponse?: {
    count: number
    data: Tag[]
  }
}

export async function action({
  request,
}: {
  request: Request
}): Promise<ActionResponse | null> {
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
        action: ResourceAction.TAGS_REFETCH,
        tagsResponse: await fetchTagsData(),
      }

    case ResourceAction.ADD_COMPANY:
      return await safeExecute(async () => {
        await addCompany(data)
        return { action: ResourceAction.ADD_COMPANY }
      })

    default:
      return null
  }
}

export default function AddCompanyPage() {
  const fetcher = useFetcher<ActionResponse>()

  // Local States
  const [tags, setTags] = useState<Tag[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)

  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const navigate = useNavigate()

  const tagOptions: SelectOptionRecord[] = useMemo(
    () => tags.map((t) => ({ value: t.id, label: t.title })),
    [tags]
  )

  useEffect(() => {
    if (fetcher.data && !fetcher.data?.error) {
      if (fetcher.data.tagsResponse) {
        setTags(fetcher.data.tagsResponse.data)
        setTotalCount(fetcher.data.tagsResponse.count)
      }
    }
  }, [fetcher.data])

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      if (fetcher.data.error) {
        toast.error(fetcher.data.error)
      } else if (fetcher.data.action) {
        const { action } = fetcher.data

        switch (action) {
          case ResourceAction.ADD_COMPANY:
            toast.success(SUCCESS_MSG.COMPANY_ADDED)
            navigate(-1)
            break

          default:
            break
        }
      }
    }
  }, [fetcher.state, fetcher.data])

  useEffect(() => {
    fetcher.submit(
      { action: ResourceAction.TAGS_REFETCH },
      { method: 'POST', encType: 'application/json' }
    )
  }, [])

  // Initialize the form with react-hook-form and Zod validation
  const form = useForm<ModifyCompany>({
    resolver: zodResolver(ModifyCompanySchema),
    defaultValues: {
      title: '',
      location: '',
      description: '',
    },
  })

  const handleSubmit = (values: ModifyCompany) => {
    fetcher.submit(
      {
        action: ResourceAction.ADD_COMPANY,
        ...values,
        ...(selectedTags.length && { tags: selectedTags }),
      },
      { method: 'POST', encType: 'application/json' }
    )
  }

  return (
    <div className="container mx-auto max-w-2xl">
      {/* Header */}
      <PageTitle title={LABELS.ADD_NEW_COMPANY} />

      {/* Form */}
      <Form {...form}>
        <form
          id={CONSTANTS.MODIFY_COMPANY_FORM}
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8">
          <div className="space-y-4">
            {MODIFY_COMPANY_FIELDS.map((f) =>
              f.type === INPUT_TYPES.TEXTAREA ? (
                <CommonTextarea
                  key={f.name}
                  name={f.name}
                  label={f.label}
                  placeholder={f.placeholder}
                  readOnly={f.readOnly}
                  control={form.control}
                />
              ) : (
                <CommonTextField
                  key={f.name}
                  name={f.name}
                  label={f.label}
                  placeholder={f.placeholder}
                  readOnly={f.readOnly}
                  control={form.control}
                />
              )
            )}

            {/* Tags Field */}
            <CommonMultiSelectMenu
              data={tagOptions}
              label={LABELS.TAGS}
              placeholder={PLACEHOLDERS.TAGS}
              values={selectedTags}
              onChange={setSelectedTags}
              readOnly={fetcher.state === 'loading'}
            />
          </div>
        </form>
      </Form>

      {/* Submit Button */}
      <SubmitBtn
        name={CONSTANTS.MODIFY_COMPANY_FORM}
        child={LABELS.ADD_COMPANY}
        className="w-full mt-10"
      />
    </div>
  )
}
