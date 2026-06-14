"use client"

import * as React from "react"
import { adminApi, type AdminFoodItem, type AdminFoodItemCreate } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, ArrowUpDown, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function FoodsTable() {
  const [foods, setFoods] = React.useState<AdminFoodItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Search state
  const [searchQuery, setSearchQuery] = React.useState("")

  // Sort state
  const [sortField, setSortField] = React.useState<keyof AdminFoodItem | null>(null)
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
  }, [searchQuery])

  // Reset selection on pagination change
  React.useEffect(() => {
    setSelectedIds(new Set())
  }, [currentPage, pageSize])

  // Filter foods
  const filteredFoods = React.useMemo(() => {
    const q = searchQuery.toLowerCase()
    return foods.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    )
  }, [foods, searchQuery])

  // Sort foods
  const sortedFoods = React.useMemo(() => {
    if (!sortField) return filteredFoods

    return [...filteredFoods].sort((a, b) => {
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

      // Numbers
      return sortDirection === "asc"
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number)
    })
  }, [filteredFoods, sortField, sortDirection])

  const totalPages = Math.ceil(sortedFoods.length / pageSize)
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1)

  // Paginated foods
  const paginatedFoods = React.useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize
    return sortedFoods.slice(start, start + pageSize)
  }, [sortedFoods, safeCurrentPage, pageSize])

  // Handlers
  function handleSort(field: keyof AdminFoodItem) {
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
      const visibleIds = paginatedFoods.map(f => f.id)
      setSelectedIds(prev => {
        const next = new Set(prev)
        visibleIds.forEach(id => next.add(id))
        return next
      })
    } else {
      const visibleIds = paginatedFoods.map(f => f.id)
      setSelectedIds(prev => {
        const next = new Set(prev)
        visibleIds.forEach(id => next.delete(id))
        return next
      })
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Are you sure you want to delete the ${selectedIds.size} selected food items?`)) return
    setLoading(true)
    try {
      await Promise.all(
        Array.from(selectedIds).map(id => adminApi.foods.delete(id))
      )
      setSelectedIds(new Set())
      loadData()
    } catch (err: unknown) {
      alert((err as Error).message)
      setLoading(false)
    }
  }

  const isAllSelected = paginatedFoods.length > 0 && paginatedFoods.every(f => selectedIds.has(f.id))
  const isSomeSelected = paginatedFoods.length > 0 && paginatedFoods.some(f => selectedIds.has(f.id)) && !isAllSelected

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [uploadingImage, setUploadingImage] = React.useState(false)

  // Form state
  const [formData, setFormData] = React.useState<AdminFoodItemCreate>({
    name: "",
    category: "makanan",
    calories_per_serving: 0,
    protein_per_serving: 0,
    carbs_per_serving: 0,
    fat_per_serving: 0,
    serving_unit: "porsi",
    serving_size_g: null,
    imageUrl: null,
    isActive: true,
  })

  async function loadData() {
    setLoading(true)
    try {
      const data = await adminApi.foods.list()
      setFoods(data)
    } catch (err: unknown) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  function openCreate() {
    setEditingId(null)
    setFormData({
      name: "",
      category: "makanan",
      calories_per_serving: 0,
      protein_per_serving: 0,
      carbs_per_serving: 0,
      fat_per_serving: 0,
      serving_unit: "porsi",
      serving_size_g: null,
      imageUrl: null,
      isActive: true,
    })
    setDialogOpen(true)
  }

  function openEdit(food: AdminFoodItem) {
    setEditingId(food.id)
    setFormData({
      name: food.name,
      category: food.category,
      calories_per_serving: food.calories_per_serving,
      protein_per_serving: food.protein_per_serving,
      carbs_per_serving: food.carbs_per_serving,
      fat_per_serving: food.fat_per_serving,
      serving_unit: food.serving_unit,
      serving_size_g: food.serving_size_g,
      imageUrl: food.imageUrl,
      isActive: food.isActive,
    })
    setDialogOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this food item?")) return
    try {
      await adminApi.foods.delete(id)
      loadData()
    } catch (err: unknown) {
      alert((err as Error).message)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await adminApi.foods.update(editingId, formData)
      } else {
        await adminApi.foods.create(formData)
      }
      setDialogOpen(false)
      loadData()
    } catch (err: unknown) {
      alert((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const { url } = await adminApi.foods.uploadImage(file)
      setFormData(prev => ({ ...prev, imageUrl: url }))
    } catch (err: any) {
      alert("Image upload failed: " + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Top Bar with Search, Bulk Action and Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search foods…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {selectedIds.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedIds.size})
            </Button>
          )}
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Food Item
        </Button>
      </div>

      {error && <div className="text-destructive text-sm">{error}</div>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-center">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="text-center">Image</TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center justify-center gap-1">
                  Name
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "name" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center justify-center gap-1">
                  Category
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "category" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("calories_per_serving")}
              >
                <div className="flex items-center justify-center gap-1">
                  Calories
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "calories_per_serving" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("protein_per_serving")}
              >
                <div className="flex items-center justify-center gap-1">
                  Protein
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "protein_per_serving" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("carbs_per_serving")}
              >
                <div className="flex items-center justify-center gap-1">
                  Carbs
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "carbs_per_serving" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("fat_per_serving")}
              >
                <div className="flex items-center justify-center gap-1">
                  Fat
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "fat_per_serving" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead className="text-center">Serving Unit</TableHead>
              <TableHead 
                className="text-center cursor-pointer select-none hover:bg-muted/50"
                onClick={() => handleSort("isActive")}
              >
                <div className="flex items-center justify-center gap-1">
                  Status
                  <ArrowUpDown className={`ml-1 h-3.5 w-3.5 inline ${sortField === "isActive" ? "text-primary font-bold" : "text-muted-foreground/30"}`} />
                </div>
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-4">Loading...</TableCell>
              </TableRow>
            ) : filteredFoods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-4">No food items found.</TableCell>
              </TableRow>
            ) : (
              paginatedFoods.map((food) => (
                <TableRow key={food.id}>
                  <TableCell className="w-12 text-center">
                    <Checkbox
                      checked={selectedIds.has(food.id)}
                      onCheckedChange={(checked) => handleSelectRow(food.id, !!checked)}
                      aria-label={`Select ${food.name}`}
                    />
                  </TableCell>
                  <TableCell className="text-center flex justify-center">
                    {food.imageUrl ? (
                      <img src={food.imageUrl} alt={food.name} className="w-12 h-12 object-cover rounded-md" />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">None</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {food.name}
                  </TableCell>
                  <TableCell className="capitalize text-center">
                    {food.category}
                  </TableCell>
                  <TableCell className="text-center">{food.calories_per_serving} kcal</TableCell>
                  <TableCell className="text-center">{food.protein_per_serving} g</TableCell>
                  <TableCell className="text-center">{food.carbs_per_serving} g</TableCell>
                  <TableCell className="text-center">{food.fat_per_serving} g</TableCell>
                  <TableCell className="text-center">
                    {food.serving_unit} {food.serving_size_g ? `(${food.serving_size_g}g)` : ""}
                  </TableCell>
                  <TableCell className="text-center">
                    {food.isActive ? (
                      <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(food)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(food.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {!loading && filteredFoods.length > 0 && (
        <div className="flex items-center justify-between px-2 py-2">
          <div className="text-sm text-muted-foreground">
            Showing {((safeCurrentPage - 1) * pageSize) + 1} to {Math.min(safeCurrentPage * pageSize, filteredFoods.length)} of {filteredFoods.length} items
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
                <ChevronLeft className="h-4 w-4 mr-1" />
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
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Food Item" : "New Food Item"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Make changes to this food item here." : "Add a new food item to the catalog."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Nasi Goreng"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="makanan">Makanan</SelectItem>
                      <SelectItem value="minuman">Minuman</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Serving Unit</Label>
                  <Input
                    required
                    value={formData.serving_unit}
                    onChange={(e) => setFormData({ ...formData, serving_unit: e.target.value })}
                    placeholder="e.g. porsi, piring, gelas, bungkus"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Serving Weight (optional, grams)</Label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.serving_size_g ?? ""}
                    onChange={(e) => setFormData({ ...formData, serving_size_g: e.target.value ? parseFloat(e.target.value) : null })}
                    placeholder="e.g. 150"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Image File</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <p className="text-xs text-muted-foreground">Uploading image...</p>}
                  {formData.imageUrl && (
                    <p className="text-xs text-green-600 truncate">
                      Uploaded: <a href={formData.imageUrl} target="_blank" rel="noreferrer" className="underline">View</a>
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column (Nutritional Stats) */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Calories (kcal per serving)</Label>
                  <Input
                    type="number"
                    step="any"
                    required
                    value={formData.calories_per_serving}
                    onChange={(e) => setFormData({ ...formData, calories_per_serving: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Protein (grams per serving)</Label>
                  <Input
                    type="number"
                    step="any"
                    required
                    value={formData.protein_per_serving}
                    onChange={(e) => setFormData({ ...formData, protein_per_serving: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Carbs (grams per serving)</Label>
                  <Input
                    type="number"
                    step="any"
                    required
                    value={formData.carbs_per_serving}
                    onChange={(e) => setFormData({ ...formData, carbs_per_serving: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fat (grams per serving)</Label>
                  <Input
                    type="number"
                    step="any"
                    required
                    value={formData.fat_per_serving}
                    onChange={(e) => setFormData({ ...formData, fat_per_serving: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.isActive ? "active" : "inactive"} onValueChange={(val) => setFormData({ ...formData, isActive: val === "active" })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
