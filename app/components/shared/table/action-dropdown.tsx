import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu'
import { Button } from '~/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { COMMON_DATA_ACTIONS, CommonDataActionsType } from '~/lib/data'
import { NAMES } from '~/lib/form'

interface ActionDropdownProps {
  onEdit: () => void
  onDelete: () => void
}

export const ActionDropdown = ({ onEdit, onDelete }: ActionDropdownProps) => {
  const handleActionClick = (action: CommonDataActionsType) => {
    // Handle action click
    switch (action.value) {
      case NAMES.EDIT:
        onEdit()
        break
      case NAMES.DELETE:
        onDelete()
        break
    }
  }

  return (
    <DropdownMenu>
      {/* Trigger: Three-dot icon */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="size-7">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      {/* Content: Dropdown menu */}
      <DropdownMenuContent
        align="end"
        className="w-28">
        {COMMON_DATA_ACTIONS.map((a) => (
          <DropdownMenuItem
            onClick={() => handleActionClick(a)}
            key={a.value}>
            {a.icon} {a.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
