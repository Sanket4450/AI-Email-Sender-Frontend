import { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface DataCardProps {
  title: string
  value: string
  Icon: any
}

export const DataCard = memo(({ title, value, Icon }: DataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon
          size={16}
          className="text-muted-foreground"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
})
