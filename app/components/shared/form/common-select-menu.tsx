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
import { useCallback, useMemo, useState } from 'react'

interface SelectMenuProps {
  data: SelectOption[]
  selectedOption: string | null
  label: string
  placeholder: string
  readOnly?: boolean
  includeLabel?: boolean
  onChange: (option: string | null) => void
  labelStyles?: string
}

export const CommonSelectMenu = ({
  data,
  selectedOption,
  label,
  placeholder,
  readOnly,
  onChange,
  includeLabel = true,
  labelStyles,
}: SelectMenuProps) => {
  const [open, setOpen] = useState(false)

  const activeOption = useMemo(
    () => data.find((d) => d.value === selectedOption),
    [data, selectedOption]
  )

  const handleToggle = useCallback(
    (v: string) => {
      setOpen(false)
      onChange(selectedOption === v ? null : v)
    },
    [selectedOption, onChange]
  )

  return (
    <div className="w-full space-y-2">
      {/* Label */}
      {includeLabel && (
        <Label className={cn('w-full', labelStyles)}>{label}</Label>
      )}

      {/* Popover Trigger and Content */}
      <Popover
        open={open}
        onOpenChange={setOpen}>
        {/* Popover Trigger */}
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full rounded-md text-sm py-2 px-3 border border-input focus:border-foreground bg-background text-left focus:outline-none disabled:opacity-50"
            disabled={readOnly}>
            {activeOption ? (
              `${activeOption.label} ${activeOption.subLabel}`
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </button>
        </PopoverTrigger>

        {!readOnly && (
          <PopoverContent
            side="bottom"
            align="start"
            className="max-h-48 overflow-auto py-2 px-0 divide-y divide-input"
            style={{ width: 'max-content' }}>
            {!data.length ? (
              <NoDataFound message={INFO_MSG.NO_DATA_FOUND} />
            ) : (
              data.map((item) => (
                <div
                  key={item.value}
                  className={cn(
                    `h-8 w-full flex justify-between items-center space-x-2 text-sm px-2 transition-colors duration-200`,
                    !readOnly && 'hover:cursor-pointer',
                    selectedOption === item.value
                      ? 'bg-primary text-white'
                      : 'hover:bg-accent'
                  )}
                  onClick={() => !readOnly && handleToggle(item.value)}>
                  <p>{item.label}</p>
                  {!!item.subLabel && (
                    <p className="text-[13px]">{item.subLabel}</p>
                  )}
                </div>
              ))
            )}
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}
