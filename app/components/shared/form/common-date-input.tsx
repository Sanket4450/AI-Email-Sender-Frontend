import { Control } from 'react-hook-form'
import { CalendarIcon } from 'lucide-react'
import { cn, formatDate } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'

interface CommonInputDateProps {
  name: string
  label: string
  placeholder: string
  control: Control<any>
  disabled?: boolean
  labelStyles?: string
}

export const CommonInputDate = ({
  name,
  label,
  placeholder,
  control,
  disabled = false,
  labelStyles = '',
}: CommonInputDateProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="w-full flex flex-col gap-y-2">
            <FormLabel className={cn('w-full', labelStyles)}>{label}</FormLabel>

            <Popover>
              <PopoverTrigger
                asChild
                disabled={disabled}>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full h-10 justify-between text-left border border-input rounded-full font-semibold',
                    !field.value && 'text-muted-foreground'
                  )}>
                  {field.value ? (
                    formatDate(field.value)
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
