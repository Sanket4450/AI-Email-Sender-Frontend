import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

interface CommonTextareaProps {
  name: string;
  label: string;
  placeholder: string;
  control: Control<any>;
  readOnly?: boolean;
  labelStyles?: string;
}

export const CommonTextarea = ({
  name,
  label,
  placeholder,
  control,
  readOnly = false,
  labelStyles = '',
}: CommonTextareaProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn('w-full', labelStyles)}>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              autoComplete="off"
              readOnly={readOnly}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}


export const FullTextarea = ({
  name,
  label,
  placeholder,
  control,
  readOnly = false,
  labelStyles = '',
}: CommonTextareaProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="h-full flex flex-col">
          <FormLabel className={cn('w-full', labelStyles)}>{label}</FormLabel>
          <FormControl>
            <Textarea
              placeholder={placeholder}
              autoComplete="off"
              readOnly={readOnly}
              className="flex-1 min-h-0 overflow-y-auto resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
