import { Edit, Trash } from 'lucide-react'
import { LABELS, NAMES } from './form'

export interface CommonDataActionsType {
  value: string
  label: string
  icon?: React.ReactNode
}

export const COMMON_DATA_ACTIONS: CommonDataActionsType[] = [
  {
    value: NAMES.EDIT,
    label: LABELS.EDIT,
    icon: <Edit />,
  },
  {
    value: NAMES.DELETE,
    label: LABELS.DELETE,
    icon: <Trash />,
  },
]
