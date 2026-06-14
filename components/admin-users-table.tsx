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
import { SearchIcon, PencilIcon, Trash2Icon, ChevronLeftIcon, ChevronRightIcon, ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface AdminUsersTableProps {
  data: AdminUserRow[]
  loading?: boolean
  onEdit?: (user: AdminUserRow) => void
  onDelete?: (id: string) => void
  onBulkDelete?: (ids: string[]) => void
}

export function AdminUsersTable({ data, loading, onEdit, onDelete, onBulkDelete }: AdminUsersTableProps) {
  const [search, setSearch] = React.useState("")

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase()
    return data.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    )
  }, [data, search])

  // Sort state
  const [sortField, setSortField] = React.useState<keyof AdminUserRow | null>(null)
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")

  // Bulk select state
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  // Reset page and selection on search
  React.useEffect(() => {
    setCurrentPage(1)
    setSelectedIds(new Set())
  }, [search])

  // Reset selection on page change
  React.useEffect(() => {
    setSelectedIds(new Set())
  }, [currentPage, pageSize])

  // Sort users
  const sortedUsers = React.useMemo(() => {
    if (!sortField) return filtered

    return [...filtered].sort((a, b) => {
      const valA = a[sortField]
      const valB = b[sortField]

      if (valA === null || valA === undefined) return 1
      if (valB === null || valB === undefined) return -1

      if (typeof valA === "string" && typeof valB === "string") {
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
      }

      if (typeof valA === "boolean" && typeof valB === "boolean") {
        return sortDirection === "asc"
          ? (valA ? 1 : 0) - (valB ? 1 : 0)
          : (valB ? 1 : 0) - (valA ? 1 : 0)
      }

      // Dates
      if (sortField === "createdAt" || sortField === "deletedAt") {
        const timeA = new Date(valA as string).getTime()
        const timeB = new Date(valB as string).getTime()
        return sortDirection === "asc" ? timeA - timeB : timeB - timeA
      }

      return 0
    })
  }, [filtered, sortField, sortDirection])

  const totalPages = Math.ceil(sortedUsers.length / pageSize)
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1)

  // Paginated users
  const paginatedUsers = React.useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize
    return sortedUsers.slice(start, start + pageSize)
  }, [sortedUsers, safeCurrentPage, pageSize])

  // Handlers
  function handleSort(field: keyof AdminUserRow) {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  function handleSelectRow(id: string, checked: boolean) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  function handleSelectAll(checked: boolean) {
    if (checked) {
      const visibleIds = paginatedUsers.map(u => u.id)
      setSelectedIds(prev => {
        const next = new Set(prev)
        visibleIds.forEach(id => next.add(id))
        return next
      })
    } else {
      const visibleIds = paginatedUsers.map(u => u.id)
      setSelectedIds(prev => {
        const next = new Set(prev)
        visibleIds.forEach(id => next.delete(id))
        return next
      })
    }
  }

  function handleBulkDelete() {
    if (onBulkDelete && selectedIds.size > 0) {
      onBulkDelete(Array.from(selectedIds))
      setSelectedIds(new Set())
    }
  }

  const isAllSelected = paginatedUsers.length > 0 && paginatedUsers.every(u => selectedIds.has(u.id))
  const isSomeSelected = paginatedUsers.length > 0 && paginatedUsers.some(u => selectedIds.has(u.id)) && !isAllSelected

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Search bar and Bulk Delete button */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {selectedIds.size > 0 && onBulkDelete && (
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            <Trash2Icon className="mr-2 h-4 w-4" /> Delete Selected ({selectedIds.size})
          </Button>
        )}
        <span className="text-sm text-muted-foreground ml-auto">
          {filtered.length} user{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              <TableHead className="w-12 text-center">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("username")}
              >
                <div className="flex items-center justify-center gap-1">
                  Username
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "username" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center justify-center gap-1">
                  Email
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "email" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("authProvider")}
              >
                <div className="flex items-center justify-center gap-1">
                  Provider
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "authProvider" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("is_admin")}
              >
                <div className="flex items-center justify-center gap-1">
                  Role
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "is_admin" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("deletedAt")}
              >
                <div className="flex items-center justify-center gap-1">
                  Status
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "deletedAt" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center justify-center gap-1">
                  Joined
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "createdAt" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="w-12 text-center">
                    <Checkbox
                      checked={selectedIds.has(user.id)}
                      onCheckedChange={(checked) => handleSelectRow(user.id, !!checked)}
                      aria-label={`Select ${user.username}`}
                    />
                  </TableCell>
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

      {/* Pagination Footer */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between px-2 py-2">
          <div className="text-sm text-muted-foreground">
            Showing {((safeCurrentPage - 1) * pageSize) + 1} to {Math.min(safeCurrentPage * pageSize, filtered.length)} of {filtered.length} items
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  setPageSize(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="text-sm font-medium px-2">
                Page {safeCurrentPage} of {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage >= totalPages}
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
