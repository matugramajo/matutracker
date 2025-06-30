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
]

export type MediaItem = {
  id: string
  title: string
  cover_url?: string
  content_type: "anime" | "movie" | "series" | "game" | "album"
  status: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch"
  date_added: string
  platform?: string
  personal_score?: number
  notes?: string
  created_at: string
  updated_at: string
} 