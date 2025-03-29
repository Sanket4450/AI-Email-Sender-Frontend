import { Input } from '~/components/ui/input'
import { NAMES, PLACEHOLDERS } from '~/lib/form'

interface SearchFieldProps {
  name?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export const SearchField = ({
  name,
  placeholder,
  value,
  onChange,
}: SearchFieldProps) => {
  return (
    <Input
      type="text"
      name={name || NAMES.SEARCH}
      placeholder={placeholder || PLACEHOLDERS.SEARCH}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-64"
    />
  )
}
