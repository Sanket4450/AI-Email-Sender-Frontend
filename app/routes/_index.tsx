import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Progress } from '~/components/ui/progress'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Mail, MousePointer, Reply, AlertTriangle } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="flex-1 p-6 bg-gray-50 overflow-auto">
      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Mail className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.5%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42.3%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Reply Rate</CardTitle>
            <Reply className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.1%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4%</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  Email delivered to John Smith
                </p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  Email opened by Sarah Johnson
                </p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarFallback>MW</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  Reply received from Mike Wilson
                </p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-right">
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline">
              View all
            </a>
          </div>
        </CardContent>
      </Card>

      {/* ESP Status Section */}
      <Card>
        <CardHeader>
          <CardTitle>ESP Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SendGrid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-medium">SendGrid</span>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
              <div className="text-sm text-gray-600 mb-1">
                Emails Sent: 882/1000
              </div>
              <Progress
                value={88.2}
                className="h-2"
              />
            </div>

            {/* Mailgun */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-medium">Mailgun</span>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>
              <div className="text-sm text-gray-600 mb-1">
                Emails Sent: 445/1000
              </div>
              <Progress
                value={44.5}
                className="h-2"
              />
            </div>

            {/* Brevo */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-medium">Brevo</span>
                </div>
                <Badge
                  variant="default"
                  className="bg-yellow-100 text-yellow-800">
                  Warning
                </Badge>
              </div>
              <div className="text-sm text-gray-600 mb-1">
                Emails Sent: 912/1000
              </div>
              <Progress
                value={91.2}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
