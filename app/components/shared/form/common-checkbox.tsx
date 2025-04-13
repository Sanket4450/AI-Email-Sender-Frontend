import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'

interface CommonCheckboxProps {
  name: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}
export const CommonCheckbox = ({
  name,
  label,
  checked,
  onChange,
}: CommonCheckboxProps) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={name}
        checked={checked}
        onCheckedChange={onChange}
      />
      <Label>{label}</Label>
    </div>
  )
}
