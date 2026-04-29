"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { UsersIcon, ActivityIcon, DumbbellIcon, MessageSquareIcon } from "lucide-react"
import type { AdminStats } from "@/lib/api"

interface SectionCardsProps {
  stats?: AdminStats | null
  loading?: boolean
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  loading,
}: {
  label: string
  value: string | number
  sub: string
  icon: React.ElementType
  loading?: boolean
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {loading ? (
            <span className="inline-block h-8 w-24 animate-pulse rounded bg-muted" />
          ) : (
            value.toLocaleString()
          )}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <Icon className="size-3.5" />
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="text-muted-foreground">{sub}</div>
      </CardFooter>
    </Card>
  )
}

export function SectionCards({ stats, loading }: SectionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <StatCard
        label="Total Users"
        value={stats?.total_users ?? 0}
        sub="All registered accounts"
        icon={UsersIcon}
        loading={loading}
      />
      <StatCard
        label="Active Users"
        value={stats?.active_users ?? 0}
        sub="Accounts not deleted"
        icon={ActivityIcon}
        loading={loading}
      />
      <StatCard
        label="Total Workouts"
        value={stats?.total_workouts ?? 0}
        sub="Workout sessions logged"
        icon={DumbbellIcon}
        loading={loading}
      />
      <StatCard
        label="Chat Sessions"
        value={stats?.total_chats ?? 0}
        sub="AI coach conversations"
        icon={MessageSquareIcon}
        loading={loading}
      />
    </div>
  )
}
