import { LABELS } from '~/lib/form'
import { Button } from '../../ui/button'
import { ClassValue } from 'clsx'
import { cn } from '~/lib/utils'
import { CONSTANTS } from '~/lib/constants'
import { Spinner } from './spinner'

interface ButtonProps {
  isLoading?: boolean
  child?: React.ReactNode
  onClick: () => void
}

interface CancelButtonProps extends ButtonProps {
  child?: React.ReactNode
}

export const CancelBtn = ({
  child,
  isLoading = false,
  onClick,
}: CancelButtonProps) => {
  return (
    <Button
      disabled={isLoading}
      variant="secondary"
      className="font-bold py-2 px-4 rounded"
      onClick={onClick}>
      {child || LABELS.CANCEL}
    </Button>
  )
}

interface ActionButtonProps extends ButtonProps {
  child: React.ReactNode
  className?: ClassValue
}

export const ActionBtn = ({
  child,
  isLoading = false,
  onClick,
  className,
}: ActionButtonProps) => {
  return (
    <Button
      disabled={isLoading}
      className={cn(
        'bg-primary hover:bg-primary-foreground text-white font-bold py-2 px-4 rounded',
        className
      )}
      onClick={onClick}>
      {isLoading ? <Spinner /> : child}
    </Button>
  )
}

interface SubmitButtonProps {
  child?: React.ReactNode
  name: string
  isLoading?: boolean
  className?: ClassValue
}

export const SubmitBtn = ({
  child,
  name,
  isLoading = false,
  className,
}: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      form={name}
      disabled={isLoading}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      className={cn(
        'bg-primary hover:bg-primary-foreground text-white font-bold py-2 px-4 rounded',
        className
      )}>
      {child || CONSTANTS.SUBMIT}
    </Button>
  )
}
