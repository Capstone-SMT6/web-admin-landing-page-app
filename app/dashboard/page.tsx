"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { AdminUsersTable } from "@/components/admin-users-table"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { adminApi, clearAdminToken, type AdminStats, type AdminUserRow, type RegistrationDataPoint } from "@/lib/api"

export default function Page() {
  const router = useRouter()
  const [stats, setStats] = React.useState<AdminStats | null>(null)
  const [users, setUsers] = React.useState<AdminUserRow[]>([])
  const [chart, setChart] = React.useState<RegistrationDataPoint[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchAll() {
      try {
        const [statsData, usersData, chartData] = await Promise.all([
          adminApi.stats(),
          adminApi.users(),
          adminApi.chart(),
        ])
        setStats(statsData)
        setUsers(usersData)
        setChart(chartData)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to load data"
        // If 401/403, the token is gone — go back to login
        if (msg.includes("401") || msg.includes("403") || msg.includes("Not authenticated")) {
          clearAdminToken()
          document.cookie = "admin_token=; path=/; max-age=0"
          router.replace("/admin/login")
          return
        }
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [router])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

              {error && (
                <div className="mx-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive lg:mx-6">
                  ⚠ {error}
                </div>
              )}

              {/* Stats cards */}
              <SectionCards stats={stats} loading={loading} />

              {/* Registration trend chart */}
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={chart} loading={loading} />
              </div>

              {/* Users table */}
              <AdminUsersTable data={users} loading={loading} />

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
