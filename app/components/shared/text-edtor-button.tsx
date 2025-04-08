import { cn } from '~/lib/utils'
import { ButtonProps } from '../ui/button'

interface TextEditorButtonProps extends ButtonProps {
  isActive?: boolean
  disabled?: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
}

export const TextEditorIcon = ({
  isActive = false,
  disabled = false,
  onClick,
  children,
  className,
}: TextEditorButtonProps) => {
  return (
    <button
      disabled={disabled}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md',
        disabled ? 'opacity-50' : 'hover:bg-accent',
        isActive && 'bg-accent',
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
