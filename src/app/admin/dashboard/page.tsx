import { getAdminStats } from "@/services/application"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { FileText, Activity, Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  const cards = [
    {
      label: "Applications",
      value: stats.total_applications,
      icon: FileText,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-950",
    },
    {
      label: "Today's",
      value: stats.today_applications,
      icon: Activity,
      color: "text-green-600 bg-green-100 dark:bg-green-950",
    },
    {
      label: "OTP Attempts",
      value: stats.total_otp_attempts,
      icon: Users,
      color: "text-purple-600 bg-purple-100 dark:bg-purple-950",
    },
  ]

  return (
    <div>
      <div className="mb-5 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Overview of application statistics
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="rounded-2xl md:rounded-xl">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <span className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
                    {card.label}
                  </span>
                  <div className={`rounded-lg p-1.5 md:p-2 ${card.color}`}>
                    <Icon className="h-3.5 w-3.5 md:h-5 md:w-5" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-5 md:mt-8">
        <Card className="rounded-2xl md:rounded-xl">
          <CardContent className="p-4 md:p-6">
            <h2 className="text-sm md:text-base font-semibold mb-3">Quick Actions</h2>
            <Link
              href="/admin/applications"
              className="inline-flex items-center justify-center gap-2 h-12 md:h-11 px-5 md:px-4 rounded-xl md:rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium w-full md:w-auto"
            >
              <FileText className="h-4 w-4" />
              View All Applications
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
