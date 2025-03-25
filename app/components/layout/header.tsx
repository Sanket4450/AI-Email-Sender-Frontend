import { Bell, Mail } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { VALUES } from '~/lib/values'
import { CONSTANTS } from '~/lib/constants'

export default function Header() {
  return (
    <header
      className="sticky top-0 flex items-center justify-between p-4 bg-white border-b border-gray-200"
      style={{ height: VALUES.HEADER_HEIGHT }}>
      <div className="flex items-center">
        <Mail className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-xl font-bold text-gray-800">{CONSTANTS.APP_NAME}</h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Bell className="h-5 w-5 text-gray-500" />
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
    </header>
  )
}
