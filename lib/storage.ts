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

const STORAGE_KEY = "media_tracker_items"

// Generate sample data
const generateSampleData = (): MediaItem[] => [
  {
    id: "1",
    title: "Attack on Titan",
    content_type: "anime",
    status: "completed",
    platform: "Crunchyroll",
    personal_score: 9,
    notes: "Increíble historia y animación",
    cover_url: "/placeholder.svg?height=300&width=200",
    date_added: "2024-01-15T10:00:00Z",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "The Last of Us",
    content_type: "game",
    status: "completed",
    platform: "PlayStation",
    personal_score: 10,
    notes: "Obra maestra del gaming",
    cover_url: "/placeholder.svg?height=300&width=200",
    date_added: "2024-01-10T14:30:00Z",
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T14:30:00Z",
  },
  {
    id: "3",
    title: "Stranger Things",
    content_type: "series",
    status: "watching",
    platform: "Netflix",
    personal_score: 8,
    notes: "Muy entretenida, esperando nueva temporada",
    cover_url: "/placeholder.svg?height=300&width=200",
    date_added: "2024-01-05T16:45:00Z",
    created_at: "2024-01-05T16:45:00Z",
    updated_at: "2024-01-05T16:45:00Z",
  },
  {
    id: "4",
    title: "Dune",
    content_type: "movie",
    status: "completed",
    platform: "HBO Max",
    personal_score: 9,
    notes: "Visualmente espectacular",
    cover_url: "/placeholder.svg?height=300&width=200",
    date_added: "2023-12-28T20:15:00Z",
    created_at: "2023-12-28T20:15:00Z",
    updated_at: "2023-12-28T20:15:00Z",
  },
  {
    id: "5",
    title: "Random Access Memories",
    content_type: "album",
    status: "completed",
    platform: "Spotify",
    personal_score: 8,
    notes: "Daft Punk en su mejor momento",
    cover_url: "/placeholder.svg?height=300&width=200",
    date_added: "2023-12-20T12:00:00Z",
    created_at: "2023-12-20T12:00:00Z",
    updated_at: "2023-12-20T12:00:00Z",
  },
]

export const storageService = {
  // Get all items
  getItems: (): MediaItem[] => {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        // Initialize with sample data if no data exists
        const sampleData = generateSampleData()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData))
        return sampleData
      }
      return JSON.parse(stored)
    } catch (error) {
      console.error("Error loading items from localStorage:", error)
      return []
    }
  },

  // Save all items
  saveItems: (items: MediaItem[]): void => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error("Error saving items to localStorage:", error)
    }
  },

  // Add new item
  addItem: (itemData: Partial<MediaItem>): MediaItem => {
    const items = storageService.getItems()
    const now = new Date().toISOString()

    const newItem: MediaItem = {
      id: Date.now().toString(),
      title: itemData.title || "",
      cover_url: itemData.cover_url,
      content_type: itemData.content_type as MediaItem["content_type"],
      status: itemData.status as MediaItem["status"],
      date_added: now,
      platform: itemData.platform,
      personal_score: itemData.personal_score,
      notes: itemData.notes,
      created_at: now,
      updated_at: now,
    }

    const updatedItems = [newItem, ...items]
    storageService.saveItems(updatedItems)
    return newItem
  },

  // Update existing item
  updateItem: (id: string, itemData: Partial<MediaItem>): MediaItem | null => {
    const items = storageService.getItems()
    const itemIndex = items.findIndex((item) => item.id === id)

    if (itemIndex === -1) return null

    const updatedItem: MediaItem = {
      ...items[itemIndex],
      ...itemData,
      updated_at: new Date().toISOString(),
    }

    items[itemIndex] = updatedItem
    storageService.saveItems(items)
    return updatedItem
  },

  // Delete item
  deleteItem: (id: string): boolean => {
    const items = storageService.getItems()
    const filteredItems = items.filter((item) => item.id !== id)

    if (filteredItems.length === items.length) return false

    storageService.saveItems(filteredItems)
    return true
  },

  // Clear all data (useful for testing)
  clearAll: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  },

  // Export data as JSON
  exportData: (): string => {
    const items = storageService.getItems()
    return JSON.stringify(items, null, 2)
  },

  // Import data from JSON
  importData: (jsonData: string): boolean => {
    try {
      const items = JSON.parse(jsonData) as MediaItem[]
      if (Array.isArray(items)) {
        storageService.saveItems(items)
        return true
      }
      return false
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  },
}
