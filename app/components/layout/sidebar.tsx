import { Link, NavLink } from '@remix-run/react'
import { Mail } from 'lucide-react'
import { useCallback, useState } from 'react'
import { CONSTANTS } from '~/lib/constants'
import { NAVBAR_ITEMS } from '~/lib/data'
import { cn } from '~/lib/utils'
import { VALUES } from '~/lib/values'

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)

  const expand = useCallback(() => {
    setIsExpanded(true)
  }, [setIsExpanded])

  const unexpand = useCallback(() => {
    setIsExpanded(false)
  }, [setIsExpanded])

  return (
    <>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-10"
          onClick={unexpand}
        />
      )}

      <div
        className={cn(
          'h-full fixed z-30 border-r border-border p-4 bg-background'
        )}
        style={{
          transition: `width ${VALUES.SIDEBAR_TRANSITION_DURATION} ease-in-out`,
          width: isExpanded
            ? VALUES.SIDEBAR_WIDTH
            : VALUES.COLLAPSED_SIDEBAR_WIDTH,
        }}
        onMouseEnter={expand}
        onMouseLeave={unexpand}>
        <div className="space-y-4">
          <Link
            to="/"
            className="flex items-center px-2 gap-3 rounded-lg"
            style={{ height: VALUES.SIDEBAR_ITEM_HEIGHT }}
            onClick={unexpand}>
            <Mail
              size={24}
              className="shrink-0 text-primary"
            />

            <h1
              className={cn(
                'text-lg font-bold text-foreground whitespace-nowrap',
                isExpanded ? 'opacity-100' : 'opacity-0'
              )}
              style={{
                transition: `opacity ${VALUES.SIDEBAR_LABEL_TRANSITION_DURATION} ease-in-out`,
              }}>
              {CONSTANTS.APP_NAME}
            </h1>
          </Link>

          <nav className="space-y-3">
            {NAVBAR_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-2 gap-3 rounded-lg text-sm text-foreground hover:bg-muted ${
                    isActive ? 'bg-muted font-semibold' : ''
                  }`
                }
                style={{ height: VALUES.SIDEBAR_ITEM_HEIGHT }}
                onClick={unexpand}>
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
      </div>
    </>
  )
}
