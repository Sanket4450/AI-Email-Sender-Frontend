import { Label } from '~/components/ui/label'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover'
import { Checkbox } from '~/components/ui/checkbox'
import { cn } from '~/lib/utils'
import { SelectOptionRecord } from '~/types/common'
import { Button } from '~/components/ui/button'
import { NoDataFound } from '../no-data-found'
import { INFO_MSG } from '~/lib/messages'

interface MultiSelectMenuProps {
  data: SelectOptionRecord[]
  values: string[]
  label: string
  placeholder: string
  readOnly?: boolean
  onChange: (values: string[]) => void
  labelStyles?: string
}

export const CommonMultiSelectMenu = ({
  data,
  values,
  label,
  placeholder,
  readOnly,
  onChange,
  labelStyles,
}: MultiSelectMenuProps) => {
  const handleToggle = (id: string) => {
    if (values.includes(id)) {
      onChange(values.filter((value) => value !== id))
    } else {
      onChange([...values, id])
    }
  }

  return (
    <div className="w-full space-y-2">
      {/* Label */}
      <Label className={cn('w-full', labelStyles)}>{label}</Label>

      {/* Popover Trigger and Content */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="h-10 w-full rounded-md text-sm py-2 px-3 border border-input focus:border-foreground bg-background text-left focus:outline-none disabled:opacity-50"
            disabled={readOnly}>
            {values.length > 0 ? (
              // Display selected labels if any
              data
                .filter((item) => values.includes(item.value))
                .map((item) => item.label)
                .join(', ')
            ) : (
              // Display placeholder if no selection
              <span className="text-gray-500">{placeholder}</span>
            )}
          </button>
        </PopoverTrigger>

        {!readOnly && (
          <PopoverContent
            side="bottom"
            align="start"
            className="max-h-48 overflow-y-auto p-2">
            {!data.length ? (
              <NoDataFound message={INFO_MSG.NO_COMPANIES_FOUND} />
            ) : (
              data.map((item) => (
                <div
                  key={item.value}
                  className={cn(
                    `h-8 w-full flex items-center space-x-2`,
                    !readOnly && 'hover:cursor-pointer'
                  )}
                  onClick={() => !readOnly && handleToggle(item.value)}>
                  <Checkbox
                    id={`${label}-${item.value}`}
                    checked={values.includes(item.value)}
                    onClick={(e) => e.stopPropagation()}
                    onCheckedChange={() => handleToggle(item.value)}
                  />
                  <Label
                    htmlFor={`${label}-${item.value}`}
                    className="cursor-pointer"
                    onClick={(e) => e.stopPropagation()}>
                    {item.label}
                  </Label>
                </div>
              ))
            )}
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}
