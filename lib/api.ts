const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

// ─── Admin Auth ────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string
  email: string
  username: string
}

export interface AdminLoginResponse {
  access_token: string
  token_type: string
  user: AdminUser
}

export async function adminLogin(
  email: string,
  password: string
): Promise<AdminLoginResponse> {
  const res = await fetch(`${API_URL}/admin/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? "Login failed")
  }
  return res.json()
}

// ─── User Auth (for /login and /signup pages) ──────────────────────────────────

export interface UserLoginResponse {
  access_token: string
  token_type: string
  user: {
    id: string
    email: string
    username: string
    photoUrl?: string
    is_admin: boolean
  }
}

export async function userLogin(
  email: string,
  password: string
): Promise<UserLoginResponse> {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? "Login failed")
  }
  return res.json()
}

export async function userRegister(
  username: string,
  email: string,
  password: string
): Promise<UserLoginResponse["user"]> {
  const res = await fetch(`${API_URL}/api/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? "Registration failed")
  }
  return res.json()
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("admin_token")
}

export function setAdminToken(token: string): void {
  localStorage.setItem("admin_token", token)
}

export function clearAdminToken(): void {
  localStorage.removeItem("admin_token")
}

export function getUserToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("user_token")
}

export function setUserToken(token: string): void {
  localStorage.setItem("user_token", token)
}

export function clearUserToken(): void {
  localStorage.removeItem("user_token")
}

// ─── Admin Data ────────────────────────────────────────────────────────────────

async function adminFetch<T>(path: string): Promise<T> {
  const token = getAdminToken()
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

export interface AdminStats {
  total_users: number
  active_users: number
  total_workouts: number
  total_chats: number
}

export interface AdminUserRow {
  id: string
  username: string
  email: string
  is_admin: boolean
  authProvider: string
  deletedAt: string | null
  createdAt: string
  totalPushUps: number
  totalSitUps: number
  currentStreak: number
  longestStreak: number
}

export interface RegistrationDataPoint {
  date: string
  users: number
}

export interface AdminExercise {
  id: string
  name: string
  slug: string
  description: string
  category: string
  muscleGroups: string[]
  secondaryMuscles: string[]
  equipmentRequired: string[]
  difficulty: string
  instructions: string[]
  tips: string[]
  imageUrl: string | null
  videoUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type AdminExerciseCreate = Omit<AdminExercise, "id" | "createdAt" | "updatedAt">
export type AdminExerciseUpdate = Partial<AdminExerciseCreate>

async function adminApiCall<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getAdminToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `Request failed: ${res.status}`)
  }
  return res.json()
}

export const adminApi = {
  me: () => adminFetch<AdminUser>("/admin/api/me"),
  stats: () => adminFetch<AdminStats>("/admin/api/stats"),
  users: () => adminFetch<AdminUserRow[]>("/admin/api/users"),
  chart: () => adminFetch<RegistrationDataPoint[]>("/admin/api/chart/registrations"),
  exercises: {
    list: () => adminFetch<AdminExercise[]>("/admin/api/exercises"),
    create: (data: AdminExerciseCreate) => adminApiCall<AdminExercise>("/admin/api/exercises", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: AdminExerciseUpdate) => adminApiCall<AdminExercise>(`/admin/api/exercises/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) => adminApiCall<{ message: string }>(`/admin/api/exercises/${id}`, { method: "DELETE" }),
    uploadImage: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      const token = getAdminToken()
      const res = await fetch(`${API_URL}/admin/api/exercises/upload/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) throw new Error("Image upload failed")
      return res.json() as Promise<{ url: string }>
    },
    uploadVideo: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      const token = getAdminToken()
      const res = await fetch(`${API_URL}/admin/api/exercises/upload/video`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) throw new Error("Video upload failed")
      return res.json() as Promise<{ url: string }>
    },
  }
}

