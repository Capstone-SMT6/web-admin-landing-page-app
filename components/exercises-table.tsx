"use client"

import * as React from "react"
import { adminApi, type AdminExercise, type AdminExerciseCreate } from "@/lib/api"
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
import { Plus, Pencil, Trash2 } from "lucide-react"
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

export function ExercisesTable() {
  const [exercises, setExercises] = React.useState<AdminExercise[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [uploadingImage, setUploadingImage] = React.useState(false)
  const [uploadingVideo, setUploadingVideo] = React.useState(false)

  // Form state
  const [formData, setFormData] = React.useState<AdminExerciseCreate>({
    name: "",
    slug: "",
    description: "",
    category: "strength",
    muscleGroups: [],
    secondaryMuscles: [],
    equipmentRequired: [],
    difficulty: "beginner",
    instructions: [],
    tips: [],
    imageUrl: null,
    videoUrl: null,
    isActive: true,
  })

  async function loadData() {
    setLoading(true)
    try {
      const data = await adminApi.exercises.list()
      setExercises(data)
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
      slug: "",
      description: "",
      category: "strength",
      muscleGroups: [],
      secondaryMuscles: [],
      equipmentRequired: [],
      difficulty: "beginner",
      instructions: [],
      tips: [],
      imageUrl: null,
      videoUrl: null,
      isActive: true,
    })
    setDialogOpen(true)
  }

  function openEdit(exercise: AdminExercise) {
    setEditingId(exercise.id)
    setFormData({
      name: exercise.name,
      slug: exercise.slug,
      description: exercise.description,
      category: exercise.category,
      muscleGroups: exercise.muscleGroups,
      secondaryMuscles: exercise.secondaryMuscles,
      equipmentRequired: exercise.equipmentRequired,
      difficulty: exercise.difficulty,
      instructions: exercise.instructions,
      tips: exercise.tips,
      imageUrl: exercise.imageUrl,
      videoUrl: exercise.videoUrl,
      isActive: exercise.isActive,
    })
    setDialogOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this exercise?")) return
    try {
      await adminApi.exercises.delete(id)
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
        await adminApi.exercises.update(editingId, formData)
      } else {
        await adminApi.exercises.create(formData)
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
      const { url } = await adminApi.exercises.uploadImage(file)
      setFormData(prev => ({ ...prev, imageUrl: url }))
    } catch (err: any) {
      alert("Image upload failed: " + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVideo(true)
    try {
      const { url } = await adminApi.exercises.uploadVideo(file)
      setFormData(prev => ({ ...prev, videoUrl: url }))
    } catch (err: any) {
      alert("Video upload failed: " + err.message)
    } finally {
      setUploadingVideo(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">All Exercises</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Exercise
        </Button>
      </div>

      {error && <div className="text-destructive text-sm">{error}</div>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Image</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Muscles</TableHead>
              <TableHead className="text-center">Equipment</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Difficulty</TableHead>
              <TableHead className="text-center">Created At</TableHead>
              <TableHead className="text-center">Updated At</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">Loading...</TableCell>
              </TableRow>
            ) : exercises.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">No exercises found.</TableCell>
              </TableRow>
            ) : (
              exercises.map((exercise) => (
                <TableRow key={exercise.id}>
                  <TableCell className="text-center flex justify-center">
                    {exercise.imageUrl ? (
                      <img src={exercise.imageUrl} alt={exercise.name} className="w-12 h-12 object-cover rounded-md" />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">None</div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {exercise.name}
                    <div className="text-xs text-muted-foreground">{exercise.slug}</div>
                  </TableCell>
                  <TableCell className="capitalize text-center">
                    {exercise.muscleGroups.length > 0 ? exercise.muscleGroups.join(", ") : "None"}
                  </TableCell>
                  <TableCell className="capitalize text-center">
                    {exercise.equipmentRequired.length > 0 ? exercise.equipmentRequired.join(", ") : "None"}
                  </TableCell>
                  <TableCell className="capitalize text-center">
                    {exercise.category}
                  </TableCell>
                  <TableCell className="capitalize text-center">{exercise.difficulty}</TableCell>
                  <TableCell className="text-center text-xs whitespace-nowrap text-muted-foreground">
                    {new Date(exercise.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center text-xs whitespace-nowrap text-muted-foreground">
                    {new Date(exercise.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {exercise.isActive ? (
                      <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(exercise)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(exercise.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Exercise" : "New Exercise"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Make changes to your exercise here." : "Add a new exercise to the database."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. standard-push-up"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Strength</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="flexibility">Flexibility</SelectItem>
                    <SelectItem value="balance">Balance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(val) => setFormData({ ...formData, difficulty: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Primary Muscles (comma separated)</Label>
              <Input
                required
                value={formData.muscleGroups.join(", ")}
                onChange={(e) => setFormData({ ...formData, muscleGroups: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                placeholder="e.g. chest, triceps"
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary Muscles (comma separated)</Label>
              <Input
                value={formData.secondaryMuscles.join(", ")}
                onChange={(e) => setFormData({ ...formData, secondaryMuscles: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                placeholder="e.g. shoulders, core"
              />
            </div>

            <div className="space-y-2">
              <Label>Equipment Required (comma separated)</Label>
              <Input
                value={formData.equipmentRequired.join(", ")}
                onChange={(e) => setFormData({ ...formData, equipmentRequired: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                placeholder="e.g. dumbbells, bench"
              />
            </div>

            <div className="space-y-2">
              <Label>Instructions (one per line)</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                value={formData.instructions.join("\n")}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
                placeholder="Step 1...&#10;Step 2..."
              />
            </div>

            <div className="space-y-2">
              <Label>Tips (one per line)</Label>
              <textarea
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.tips.join("\n")}
                onChange={(e) => setFormData({ ...formData, tips: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
                placeholder="Keep your back straight...&#10;Breathe out on exertion..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label>Video File</Label>
                <Input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  disabled={uploadingVideo}
                />
                {uploadingVideo && <p className="text-xs text-muted-foreground">Uploading video...</p>}
                {formData.videoUrl && (
                  <p className="text-xs text-green-600 truncate">
                    Uploaded: <a href={formData.videoUrl} target="_blank" rel="noreferrer" className="underline">View</a>
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
