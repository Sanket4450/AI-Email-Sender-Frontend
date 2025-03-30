import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form } from '~/components/ui/form'
import { Button } from '~/components/ui/button'
import { addCompany, fetchSingleCompany } from '~/api/companies'
import { useNavigate, useParams } from '@remix-run/react'
import { ModifyCompany, ModifyCompanySchema } from '~/schemas/company'
import { LABELS } from '~/lib/form'
import { MODIFY_COMPANY_FIELDS } from '~/lib/form-fields'
import { INPUT_TYPES } from '~/lib/constants'
import { CommonTextarea } from '~/components/shared/form/common-textarea'
import { CommonTextField } from '~/components/shared/form/common-text-field'
import { PageTitle } from '~/components/layout/page-title'
import { LoaderFunctionArgs } from '@remix-run/node'
import { Company } from '~/types/company'

export async function loader({ params }: LoaderFunctionArgs): Promise<Company> {
  const company = await fetchSingleCompany(params.id as string)
  return company
}

export default function EditCompanyPage() {
  const navigate = useNavigate()

  // Initialize the form with react-hook-form and Zod validation
  const form = useForm<ModifyCompany>({
    resolver: zodResolver(ModifyCompanySchema),
    defaultValues: {
      title: '',
      location: '',
      description: '',
    },
  })

  // Handle form submission
  const onSubmit: SubmitHandler<ModifyCompany> = async (data) => {
    try {
      await addCompany(data) // Call the API to add the company
      toast.success('Company added successfully!')
      navigate('/companies') // Redirect to the companies list
    } catch (error) {
      toast.error('Failed to add the company. Please try again.')
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      {/* Header */}
      <PageTitle title={LABELS.EDIT_COMPANY} />

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4">
          {MODIFY_COMPANY_FIELDS.map((f) =>
            f.type === INPUT_TYPES.TEXTAREA ? (
              <CommonTextarea
                name={f.name}
                label={f.label}
                placeholder={f.placeholder}
                readOnly={f.readOnly}
                control={form.control}
              />
            ) : (
              <CommonTextField
                name={f.name}
                label={f.label}
                placeholder={f.placeholder}
                readOnly={f.readOnly}
                control={form.control}
              />
            )
          )}

          {/* Tags Field */}
          {/* <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Combobox
                    value={field.value}
                    onChange={(selectedTags) => {
                      field.onChange(selectedTags)
                      // Add new tags to the options if they don't exist
                      const newTags = selectedTags.filter(
                        (tag) => !tagsOptions.includes(tag)
                      )
                      if (newTags.length > 0) {
                        setTagsOptions((prev) => [...prev, ...newTags])
                      }
                    }}
                    options={tagsOptions}
                    placeholder="Search or add tags..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full">
            Add Company
          </Button>
        </form>
      </Form>
    </div>
  )
}
