import { Label } from '~/components/ui/label'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover'
import { Checkbox } from '~/components/ui/checkbox'
import { cn } from '~/lib/utils'
import { SelectOption } from '~/types/common'
import { NoDataFound } from '../ui/no-data-found'
import { INFO_MSG } from '~/lib/messages'
import { CONSTANTS } from '~/lib/constants'
import { useCallback, useMemo } from 'react'

interface MultiSelectMenuProps {
  data: SelectOption[]
  selectedOptions: string[]
  label: string
  placeholder: string
  readOnly?: boolean
  includeLabel?: boolean
  showSelectedLabels?: boolean
  onChange: (options: string[]) => void
  labelStyles?: string
}

export const CommonMultiSelectMenu = ({
  data,
  selectedOptions,
  label,
  placeholder,
  readOnly,
  onChange,
  includeLabel = true,
  showSelectedLabels = true,
  labelStyles,
}: MultiSelectMenuProps) => {
  const selectedOptionLabels = useMemo(
    () =>
      data
        .filter((d) => selectedOptions.some((o) => d.value === o))
        .map((d) => d.label)
        .join(', '),
    [data, selectedOptions]
  )

  const handleToggle = useCallback(
    (v: string) => {
      if (selectedOptions.includes(v)) {
        onChange(selectedOptions.filter((sv) => sv !== v))
      } else {
        onChange([...selectedOptions, v])
      }
    },
    [selectedOptions, onChange]
  )

  const renderedLabel = !showSelectedLabels
    ? `(${selectedOptions.length}) ${CONSTANTS.SELECTED}`
    : selectedOptionLabels

  return (
    <div className="w-full space-y-2">
      {/* Label */}
      {includeLabel && (
        <Label className={cn('w-full', labelStyles)}>{label}</Label>
      )}

      {/* Popover Trigger and Content */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full rounded-md py-2 px-3 text-sm border border-input focus:border-foreground bg-background text-left focus:outline-none disabled:opacity-50"
            disabled={readOnly}>
            {selectedOptions.length > 0 ? (
              renderedLabel
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </button>
        </PopoverTrigger>

        {!readOnly && (
          <PopoverContent
            side="bottom"
            align="start"
            className="max-h-48 max-w-52 overflow-auto p-2"
            style={{ width: 'max-content' }}>
            {!data.length ? (
              <NoDataFound message={INFO_MSG.NO_DATA_FOUND} />
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
                    checked={selectedOptions.some((sv) => sv === item.value)}
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
