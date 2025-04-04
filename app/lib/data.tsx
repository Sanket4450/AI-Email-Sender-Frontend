import {
  Building,
  ChartNoAxesCombined,
  Edit,
  FileText,
  Mail,
  Send,
  Trash,
  Users,
} from 'lucide-react'
import { LABELS, NAMES } from './form'

interface NavbarItem {
  label: string
  icon: any
  path: string
}

export const NAVBAR_ITEMS: NavbarItem[] = [
  { label: 'Dashboard', icon: ChartNoAxesCombined, path: '/' },
  { label: 'Companies', icon: Building, path: '/companies' },
  { label: 'Contacts', icon: Users, path: '/contacts' },
  { label: 'Drafts', icon: FileText, path: '/drafts' },
  { label: 'Emails', icon: Mail, path: '/emails' },
  { label: 'Senders', icon: Send, path: '/senders' },
]

export interface CommonDataActionsType {
  value: string
  label: string
  icon?: React.ReactNode
}

export const COMMON_DATA_ACTIONS: CommonDataActionsType[] = [
  {
    value: NAMES.EDIT,
    label: LABELS.EDIT,
    icon: <Edit color="green" />,
  },
  {
    value: NAMES.DELETE,
    label: LABELS.DELETE,
    icon: <Trash color="red" />,
  },
]
