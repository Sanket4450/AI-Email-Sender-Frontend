import { Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { VALUES } from '~/lib/values'
import { ModeToggle } from './mode-toggle'
import { useLayout } from '~/context/layout-context'
import { useMatches } from '@remix-run/react'

type MatchHandle = {
  heading: string
  subHeading?: string
}

export default function Header() {
  const matches = useMatches()

  const { headerLabel } = useLayout()

  const currentPage = matches.find((match) => match.handle as MatchHandle)

  const { heading, subHeading } = (currentPage?.handle as MatchHandle) || {
    heading: '',
    subHeading: '',
  }

  return (
    <header
      className="fixed top-0 left-0 w-full flex items-center justify-between border-b border-border"
      style={{
        height: VALUES.HEADER_HEIGHT,
        paddingLeft: VALUES.COLLAPSED_SIDEBAR_WIDTH + VALUES.HEADER_PADDING,
        paddingRight: VALUES.HEADER_PADDING,
      }}>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">{heading}</h1>
        <p className="mt-0.5 text-muted-foreground">
          {subHeading || headerLabel}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />

        <Bell
          size={18}
          className="text-muted-foreground"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="User"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
