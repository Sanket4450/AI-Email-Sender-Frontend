import { INFO_MSG } from '~/lib/messages'

interface NoDataFoundProps {
  message?: string
}

export const NoDataFound = ({
  message = INFO_MSG.NO_DATA_FOUND,
}: NoDataFoundProps) => {
  return (
    <div className="w-full py-8 text-center text-sm text-muted-foreground">
      {message}
    </div>
  )
}
