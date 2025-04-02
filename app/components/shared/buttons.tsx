import { LABELS } from '~/lib/form'
import { Button } from '../ui/button'
import { ClassValue } from 'clsx'
import { cn } from '~/lib/utils'
import { CONSTANTS } from '~/lib/constants'

interface ButtonProps {
  child?: React.ReactNode
  onClick: () => void
}

interface CancelButtonProps extends ButtonProps {
  child?: React.ReactNode
}

export const CancelBtn = ({ child, onClick }: CancelButtonProps) => {
  return (
    <Button
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

export const ActionBtn = ({ child, onClick, className }: ActionButtonProps) => {
  return (
    <Button
      className={cn(
        'bg-primary hover:bg-primary-foreground text-white font-bold py-2 px-4 rounded',
        className
      )}
      onClick={onClick}>
      {child}
    </Button>
  )
}

interface SubmitButtonProps {
  child?: React.ReactNode
  name: string
  className?: ClassValue
}

export const SubmitBtn = ({ child, name, className }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      form={name}
      className={cn(
        'bg-primary hover:bg-primary-foreground text-white font-bold py-2 px-4 rounded',
        className
      )}>
      {child || CONSTANTS.SUBMIT}
    </Button>
  )
}
