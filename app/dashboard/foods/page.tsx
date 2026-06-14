"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { FoodsTable } from "@/components/foods-table"

export default function FoodsPage() {
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
          <div className="p-4 md:p-6 flex flex-1 flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Foods Catalog</h1>
              <p className="text-muted-foreground">Manage your food and drink intake database.</p>
            </div>
            <FoodsTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
