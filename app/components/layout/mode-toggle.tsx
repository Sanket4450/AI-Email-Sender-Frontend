import { Moon, Sun } from 'lucide-react'
import { Theme, useTheme } from 'remix-themes'

import { Button } from '../ui/button'
import { INFO_MSG } from '~/lib/messages'

export function ModeToggle() {
  const [, setTheme] = useTheme()

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{INFO_MSG.TOGGLE_THEME}</span>
    </Button>
  )
}
