import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form } from '~/components/ui/form'
import { fetchSingleCompany, updateCompany } from '~/api/companies'
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react'
import { ModifyCompany, ModifyCompanySchema } from '~/schemas/company'
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
import { Company } from '~/types/company'
import { ModifyCompanyFields } from '~/components/companies/modify-company-fields'
import { FormActionWrapper } from '~/components/shared/ui/form-action-wrapper'

export const handle = {
  heading: LABELS.EDIT_COMPANY,
}

interface EditCompanyRequest extends Filter {
  action: ResourceAction
}

export async function loader({ params }: LoaderFunctionArgs): Promise<Company> {
  const result = await fetchSingleCompany(params.id as string)
  return result
}

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<Response | null> {
  const { action, search, page, ...data }: EditCompanyRequest =
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

    case ResourceAction.EDIT_COMPANY:
      return await safeExecute(async () => {
        await updateCompany(params.id as string, data)
        return {
          success: true,
          action: ResourceAction.EDIT_COMPANY,
          message: SUCCESS_MSG.COMPANY_UPDATED,
        }
      })

    default:
      return null
  }
}

export default function EditCompanyPage() {
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
      const company = loaderData

      setSelectedTags(company.tags.map((t) => t.id))

      form.setValue('title', company.title)
      form.setValue('description', company.description)
      form.setValue('location', company.location)
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

          case ResourceAction.EDIT_COMPANY:
            toast.success(SUCCESS_MSG.COMPANY_UPDATED)
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

  const form = useForm<ModifyCompany>({
    resolver: zodResolver(ModifyCompanySchema),
    defaultValues: {
      title: '',
      location: '',
      description: '',
    },
  })

  const handleCancel = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const handleSubmit = (values: ModifyCompany) => {
    const payload = sanitizeObj(values)

    fetcher.submit(
      {
        action: ResourceAction.EDIT_COMPANY,
        ...payload,
        ...(selectedTags.length && { tags: selectedTags }),
      },
      { method: 'POST', encType: 'application/json' }
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
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
          name={CONSTANTS.MODIFY_COMPANY_FORM}
          child={LABELS.SAVE}
        />
      </FormActionWrapper>
    </div>
  )
}
