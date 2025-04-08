import { Control } from 'react-hook-form'
import { COMPOSE_EMAIL_FIELDS } from '~/lib/form-fields'
import { CommonTextField } from '../shared/form/common-text-field'
import { CommonTextarea } from '../shared/form/common-textarea'
import { INPUT_TYPES } from '~/lib/constants'
import { ComposeEmail } from '~/schemas/email'

interface ComposeEmailFieldsProps {
  control: Control<ComposeEmail>
  furtherFields?: React.ReactNode
}

export const ComposeEmailFields = ({
  control,
  furtherFields,
}: ComposeEmailFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-y-4 gap-x-6">
      {COMPOSE_EMAIL_FIELDS.map((f) =>
        f.type === INPUT_TYPES.TEXTAREA ? (
          <CommonTextarea
            key={f.name}
            name={f.name}
            label={f.label}
            placeholder={f.placeholder}
            readOnly={f.readOnly}
            control={control}
          />
        ) : (
          <CommonTextField
            key={f.name}
            name={f.name}
            label={f.label}
            placeholder={f.placeholder}
            readOnly={f.readOnly}
            control={control}
          />
        )
      )}

      {furtherFields}
    </div>
  )
}
