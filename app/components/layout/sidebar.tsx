import { NavLink } from '@remix-run/react'
import { NAVBAR_ITEMS } from '~/lib/data'
import { VALUES } from '~/lib/values'

export default function Sidebar() {
  return (
    <div
      className="h-full border-r border-border p-4"
      style={{ width: VALUES.SIDEBAR_WIDTH }}>
      <nav className="space-y-2">
        {NAVBAR_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-2 gap-3 rounded-lg text-sm text-foreground hover:bg-muted ${
                isActive ? 'bg-muted font-semibold' : ''
              }`
            }>
            <item.icon className="size-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
