import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form } from '~/components/ui/form'
import { addCompany } from '~/api/companies'
import { useFetcher, useNavigate } from '@remix-run/react'
import { ModifyCompany, ModifyCompanySchema } from '~/schemas/company'
import { LABELS, PLACEHOLDERS } from '~/lib/form'
import { MODIFY_COMPANY_FIELDS } from '~/lib/form-fields'
import { CONSTANTS, INPUT_TYPES } from '~/lib/constants'
import { CommonTextarea } from '~/components/shared/form/common-textarea'
import { CommonTextField } from '~/components/shared/form/common-text-field'
import { PageTitle } from '~/components/layout/page-title'
import { Company } from '~/types/company'
import { safeExecute } from '~/lib/utils'
import { SUCCESS_MSG } from '~/lib/messages'
import {
  Filter,
  ResourceAction,
  Response,
  SelectOptionRecord,
} from '~/types/common'
import { fetchTags } from '~/api/tags'
import { Tag } from '~/types/tag'
import { CommonMultiSelectMenu } from '~/components/shared/form/common-multi-select-menu'
import { SubmitBtn } from '~/components/shared/buttons'
import { ModifyCompanyFields } from '~/components/companies/modify-company-fields'

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
    if (fetcher.data) {
      if (fetcher.data.success) {
        const { action } = fetcher.data

        switch (action) {
          case ResourceAction.TAGS_REFETCH:
            setTags(fetcher.data.result.data)
            setTotalCount(fetcher.data.result.count)
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
          onSubmit={form.handleSubmit(handleSubmit)}>
          <ModifyCompanyFields
            control={form.control}
            furtherFields={
              <CommonMultiSelectMenu
                data={tagOptions}
                label={LABELS.TAGS}
                placeholder={PLACEHOLDERS.TAGS}
                values={selectedTags}
                onChange={setSelectedTags}
                readOnly={fetcher.state === 'loading'}
              />
            }
          />
        </form>
      </Form>

      {/* Submit Button */}
      <SubmitBtn
        name={CONSTANTS.MODIFY_COMPANY_FORM}
        child={LABELS.SAVE}
        className="w-full mt-8"
      />
    </div>
  )
}
