import { CONSTANTS } from '~/lib/constants'

interface ActionLabelProps {
  label: string
  actionLabel?: string
  onAction: () => void
}

export const ActionLabel = ({
  label,
  actionLabel = CONSTANTS.ADD,
  onAction,
}: ActionLabelProps) => {
  return (
    <p className="flex items-center gap-1">
      {label}
      <button
        className="text-[12px] font-semibold text-primary hover:text-primary-foreground"
        onClick={onAction}>
        + {actionLabel}
      </button>
    </p>
  )
}
