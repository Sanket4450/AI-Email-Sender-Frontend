import { NavLink } from '@remix-run/react'
import { useState } from 'react'
import { NAVBAR_ITEMS } from '~/lib/data'
import { cn } from '~/lib/utils'
import { VALUES } from '~/lib/values'

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        className={cn(
          'h-full fixed z-20 border-r border-border p-4 bg-background'
        )}
        style={{
          transition: `width ${VALUES.SIDEBAR_TRANSITION_DURATION} ease-in-out`,
          width: isExpanded
            ? VALUES.SIDEBAR_WIDTH
            : VALUES.COLLAPSED_SIDEBAR_WIDTH,
        }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}>
        <nav className="space-y-3">
          {NAVBAR_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-2 gap-3 rounded-lg text-sm text-foreground hover:bg-muted ${
                  isActive ? 'bg-muted font-semibold' : ''
                }`
              }
              onClick={() => setIsExpanded(false)}>
              <item.icon className="size-5 shrink-0" />
              <span
                className={cn(isExpanded ? 'opacity-100' : 'opacity-0')}
                style={{
                  transition: `opacity ${VALUES.SIDEBAR_LABEL_TRANSITION_DURATION} ease-in-out`,
                }}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  )
}
