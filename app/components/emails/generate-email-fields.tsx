import { Control } from 'react-hook-form'
import { GENERATE_EMAIL_FIELDS } from '~/lib/form-fields'
import {  FullTextarea } from '../shared/form/common-textarea'
import { GenerateEmail } from '~/schemas/email'

interface GenerateEmailFieldsProps {
  control: Control<GenerateEmail>
  furtherFields?: React.ReactNode
}

export const GenerateEmailFields = ({
  control,
  furtherFields,
}: GenerateEmailFieldsProps) => {
  return (
    <div className="h-full grid grid-cols-1 gap-y-4 gap-x-6">
      {GENERATE_EMAIL_FIELDS.map((f) => (
        <FullTextarea
          key={f.name}
          name={f.name}
          label={f.label}
          placeholder={f.placeholder}
          readOnly={f.readOnly}
          control={control}
        />
      ))}

      {furtherFields}
    </div>
  )
}
