import type { Member } from "@/interfaces/Member.interface"

import {
  CalendarDays,
  Users,
  UserCheck,
  UserX,
  Archive,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {isAfter, isBefore, addDays, startOfMonth, endOfMonth } from "date-fns"
import { cn } from "@/lib/utils"


export default function Dashboard({ members }: { members: Member[] }) {
  const today = new Date()
  const twoDaysFromNow = addDays(today, 2)
  const currentMonthStart = startOfMonth(today)
  const currentMonthEnd = endOfMonth(today)

  const stats = {
    totalMembers: members.filter((m) => !m.archived).length,
    activeMembers: members.filter((m) => m.status === "Active" && !m.archived).length,
    inactiveMembers: members.filter((m) => m.status === "Inactive" && !m.archived).length,
    archivedMembers: members.filter((m) => m.archived).length,
    expiringMembers: members.filter(
      (m) => !m.archived && isAfter(m.expiryDate, today) && isBefore(m.expiryDate, twoDaysFromNow),
    ).length,
    monthlyJoined: members.filter(
      (m) => !m.archived && isAfter(m.joinDate, currentMonthStart) && isBefore(m.joinDate, currentMonthEnd),
    ).length,
  }

  const statCards = [
    {
      title: "Total Members",
      value: stats.totalMembers,
      icon: Users,
      description: "All registered members",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Members",
      value: stats.activeMembers,
      icon: UserCheck,
      description: "Currently active",
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: "Inactive Members",
      value: stats.inactiveMembers,
      icon: UserX,
      description: "Currently inactive",
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      title: "Archived Members",
      value: stats.archivedMembers,
      icon: Archive,
      description: "Archived members",
      color: "text-gray-600 dark:text-gray-400",
    },
    {
      title: "Expiring Soon",
      value: stats.expiringMembers,
      icon: CalendarDays,
      description: "Expiring in 2 days",
      color: "text-red-600 dark:text-red-400",
    },
    {
      title: "Monthly Joined",
      value: stats.monthlyJoined,
      icon: TrendingUp,
      description: "Joined this month",
      color: "text-purple-600 dark:text-purple-400",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome to Fit Culture! 💪</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Manage your gym members efficiently with our comprehensive dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}