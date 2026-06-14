"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  UsersIcon,
  BarChart3Icon,
  Settings2Icon,
  CircleHelpIcon,
  Utensils,
} from "lucide-react"
import { adminApi, clearAdminToken, type AdminUser } from "@/lib/api"
import { ThemeToggle } from "@/components/theme-toggle"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: <UsersIcon />,
  },
  {
    title: "Foods",
    url: "/dashboard/foods",
    icon: <Utensils />,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: <BarChart3Icon />,
  },
]

const navSecondary = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: <Settings2Icon />,
  },
  {
    title: "Help",
    url: "#",
    icon: <CircleHelpIcon />,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [adminUser, setAdminUser] = React.useState<AdminUser | null>(null)

  React.useEffect(() => {
    adminApi.me().then(setAdminUser).catch(() => null)
  }, [])

  function handleLogout() {
    clearAdminToken()
    document.cookie = "admin_token=; path=/; max-age=0"
    router.push("/admin/login")
  }

  const user = adminUser
    ? {
      name: adminUser.username,
      email: adminUser.email,
      avatar: "",
    }
    : {
      name: "Admin",
      email: "Loading…",
      avatar: "",
    }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/dashboard">
                <span className="text-base font-semibold">SmaCoFit Admin</span>
              </a>
            </SidebarMenuButton>
            <ThemeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} onLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  )
}
