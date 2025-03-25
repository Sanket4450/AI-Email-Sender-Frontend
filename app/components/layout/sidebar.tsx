import { NavLink } from '@remix-run/react'
import { Building, Users, FileText, Mail, Send, ChartNoAxesCombined } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', icon: ChartNoAxesCombined, to: '/companies' },
  { name: 'Companies', icon: Building, to: '/companies' },
  { name: 'Contacts', icon: Users, to: '/contacts' },
  { name: 'Drafts', icon: FileText, to: '/drafts' },
  { name: 'Emails', icon: Mail, to: '/emails' },
  { name: 'Senders', icon: Send, to: '/senders' },
]

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 p-4">
      <div className="flex items-center mb-8">
        <Mail className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-xl font-bold text-gray-800">EmailSender</h1>
      </div>
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
