export const contentTypes = [
  { value: "anime", label: "Anime" },
  { value: "movie", label: "Película" },
  { value: "series", label: "Serie" },
  { value: "game", label: "Juego" },
  { value: "album", label: "Álbum" },
]

export const statusOptions = [
  { value: "watching", label: "En progreso" },
  { value: "completed", label: "Terminado" },
  { value: "on_hold", label: "En pausa" },
  { value: "dropped", label: "Abandonado" },
  { value: "plan_to_watch", label: "Pendiente" },
  { value: "recommendation", label: "Recomendación" },
]

export type MediaItem = {
  id: string
  title: string
  cover_url?: string
  content_type: "anime" | "movie" | "series" | "game" | "album"
  status: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch" | "recommendation"
  date_added: string
  platform?: string
  personal_score?: number
  notes?: string
  recommended_by?: string
  created_at: string
  updated_at: string
  likesCount: number
  likedIps: string[]
  likedByMe?: boolean
}

export type Comment = {
  _id: string
  mediaItemId: string
  name?: string
  text: string
  createdAt: string
  updatedAt: string
  likesCount: number
  likedIps: string[]
  likedByMe?: boolean
} 