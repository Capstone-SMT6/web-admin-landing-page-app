"use client"

import * as React from "react"
import { adminApi, type AdminUserRow } from "@/lib/api"
import { AdminUsersTable } from "@/components/admin-users-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function UsersTable() {
  const [users, setUsers] = React.useState<AdminUserRow[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  const [editingUser, setEditingUser] = React.useState<AdminUserRow | null>(null)
  const [editLoading, setEditLoading] = React.useState(false)

  async function loadData() {
    setLoading(true)
    try {
      const data = await adminApi.users()
      setUsers(data)
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      await adminApi.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingUser) return
    setEditLoading(true)
    try {
      const updated = await adminApi.updateUser(editingUser.id, {
        username: editingUser.username,
        email: editingUser.email,
        is_admin: editingUser.is_admin,
      })
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
      setEditingUser(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-destructive text-sm px-4 lg:px-6">{error}</div>}
      <AdminUsersTable data={users} loading={loading} onEdit={setEditingUser} onDelete={handleDelete} />

      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={editingUser.username} onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} required />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox id="is_admin" checked={editingUser.is_admin} onCheckedChange={(c) => setEditingUser({ ...editingUser, is_admin: c === true })} />
                <Label htmlFor="is_admin">Admin Access</Label>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                <Button type="submit" disabled={editLoading}>{editLoading ? "Saving..." : "Save Changes"}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
