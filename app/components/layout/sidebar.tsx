import { NavLink } from '@remix-run/react'
import { Building, Users, FileText, Mail, Send, ChartNoAxesCombined } from 'lucide-react'
import { VALUES } from '~/lib/values'

const navItems = [
  { name: 'Dashboard', icon: ChartNoAxesCombined, to: '/' },
  { name: 'Companies', icon: Building, to: '/companies' },
  { name: 'Contacts', icon: Users, to: '/contacts' },
  { name: 'Drafts', icon: FileText, to: '/drafts' },
  { name: 'Emails', icon: Mail, to: '/emails' },
  { name: 'Senders', icon: Send, to: '/senders' },
]

export default function Sidebar() {
  return (
    <div className="h-full bg-gray-50 border-r border-gray-200 p-4" style={{ width: VALUES.SIDEBAR_WIDTH }}>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 font-semibold' : ''
              }`
            }>
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
