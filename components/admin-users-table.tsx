"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { AdminUserRow } from "@/lib/api"
import { SearchIcon } from "lucide-react"

interface AdminUsersTableProps {
  data: AdminUserRow[]
  loading?: boolean
}

export function AdminUsersTable({ data, loading }: AdminUsersTableProps) {
  const [search, setSearch] = React.useState("")

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase()
    return data.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    )
  }, [data, search])

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <span className="text-sm text-muted-foreground">
          {filtered.length} user{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">🔥 Streak</TableHead>
              <TableHead className="text-right">Push-ups</TableHead>
              <TableHead className="text-right">Sit-ups</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.authProvider}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <Badge>Admin</Badge>
                    ) : (
                      <Badge variant="secondary">User</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.deletedAt ? (
                      <Badge variant="destructive">Deleted</Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 border-green-600/30">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {user.currentStreak}
                    {user.longestStreak > 0 && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        / {user.longestStreak} best
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {user.totalPushUps.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {user.totalSitUps.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
