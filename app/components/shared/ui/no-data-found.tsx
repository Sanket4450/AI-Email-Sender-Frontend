import { INFO_MSG } from '~/lib/messages'
import { cn } from '~/lib/utils'

interface NoDataFoundProps {
  message?: string
  space?: 'sm' | 'md' | 'lg'
}

export const NoDataFound = ({
  message = INFO_MSG.NO_DATA_FOUND,
  space = 'md',
}: NoDataFoundProps) => {
  return (
    <div
      className={cn(
        'w-full text-center text-sm text-muted-foreground',
        space === 'sm' ? 'py-4' : space === 'lg' ? 'py-12' : 'py-8'
      )}>
      {message}
    </div>
  )
}
