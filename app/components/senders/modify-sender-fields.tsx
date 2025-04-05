import { Control } from 'react-hook-form'
import { CommonTextarea } from '../shared/form/common-textarea'
import { MODIFY_COMPANY_FIELDS } from '~/lib/form-fields'
import { INPUT_TYPES } from '~/lib/constants'
import { CommonTextField } from '../shared/form/common-text-field'
import { ModifyCompany } from '~/schemas/company'

interface ModifyCompanyFieldsProps {
  control: Control<ModifyCompany>
  furtherFields?: React.ReactNode
}

export const ModifyCompanyFields = ({
  control,
  furtherFields,
}: ModifyCompanyFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-y-4 gap-x-6">
      {MODIFY_COMPANY_FIELDS.map((f) =>
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
