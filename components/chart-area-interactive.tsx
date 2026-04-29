"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { RegistrationDataPoint } from "@/lib/api"

const chartConfig = {
  users: {
    label: "New Users",
    color: "var(--primary)",
  },
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  data?: RegistrationDataPoint[]
  loading?: boolean
}

export function ChartAreaInteractive({ data = [], loading }: ChartAreaInteractiveProps) {
  // Show last 30 days, fill missing dates with 0
  const filledData = React.useMemo(() => {
    if (!data.length) return []
    const map = new Map(data.map((d) => [d.date, d.users]))
    const result: RegistrationDataPoint[] = []
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      result.push({ date: key, users: map.get(key) ?? 0 })
    }
    return result
  }, [data])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>User Registrations</CardTitle>
        <CardDescription>New user sign-ups over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex aspect-auto h-[250px] w-full animate-pulse items-center justify-center rounded-lg bg-muted">
            <span className="text-sm text-muted-foreground">Loading chart…</span>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={filledData}>
              <defs>
                <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(v) =>
                  new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} width={30} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(v) =>
                      new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="users"
                type="natural"
                fill="url(#fillUsers)"
                stroke="var(--color-users)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
