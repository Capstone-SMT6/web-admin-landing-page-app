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
import { Button } from "@/components/ui/button"
import type { AdminUserRow } from "@/lib/api"
import { SearchIcon, PencilIcon, Trash2Icon } from "lucide-react"

interface AdminUsersTableProps {
  data: AdminUserRow[]
  loading?: boolean
  onEdit?: (user: AdminUserRow) => void
  onDelete?: (id: string) => void
}

export function AdminUsersTable({ data, loading, onEdit, onDelete }: AdminUsersTableProps) {
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
              <TableHead className="text-center">Username</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Provider</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Joined</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-center">{user.username}</TableCell>
                  <TableCell className="text-muted-foreground text-center">{user.email}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="capitalize">
                      {user.authProvider}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {user.is_admin ? (
                      <Badge>Admin</Badge>
                    ) : (
                      <Badge variant="secondary">User</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.deletedAt ? (
                      <Badge variant="destructive">Deleted</Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 border-green-600/30">
                        Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm text-center">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit?.(user)}>
                        <PencilIcon className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete?.(user.id)}>
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
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
