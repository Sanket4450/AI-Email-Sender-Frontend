import { ClassValue } from 'clsx'
import { cn } from '~/lib/utils'

interface FormActionWrapperProps {
  children: React.ReactNode
  className?: ClassValue
}

export const FormActionWrapper = ({
  children,
  className,
}: FormActionWrapperProps) => {
  return (
    <div className={cn(`w-full flex justify-end gap-3`, className)}>{children}</div>
  )
}
