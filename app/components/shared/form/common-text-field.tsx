import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface CommonTextFieldProps {
  name: string;
  label: string;
  placeholder: string;
  control: Control<any>;
  readOnly?: boolean;
  labelStyles?: string;
}

export const CommonTextField = ({
  name,
  label,
  placeholder,
  control,
  readOnly = false,
  labelStyles = '',
}: CommonTextFieldProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={cn('w-full', labelStyles)}>{label}</FormLabel>
          <FormControl>
            <Input
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
