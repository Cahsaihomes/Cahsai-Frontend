"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"

export default function NotificationsPage() {
  const [allNotifications, setAllNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)

  return (
    <div className="p-6 bg-white rounded-lg min-h-screen">
      <div className="space-y-4">
        {/* All Notifications Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">All Notifications</h3>
              </div>
              <Switch
                checked={allNotifications}
                onCheckedChange={setAllNotifications}
                className="data-[state=checked]:bg-[#6F8375] scale-75"
              />
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
                className="data-[state=checked]:bg-[#6F8375] scale-75"
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications Card */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                className="data-[state=checked]:bg-green-900 scale-75"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
