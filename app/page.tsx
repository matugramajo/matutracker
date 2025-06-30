"use client"

import { useState, useEffect } from "react"
import { databaseService } from "@/lib/database"
import { type MediaItem } from "@/lib/constants"
import { MediaCard } from "@/components/media-card"
import { MediaForm } from "@/components/media-form"
import { FiltersBar } from "@/components/filters-bar"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Heart } from "lucide-react"

export default function HomePage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Filters
  const [contentTypeFilter, setContentTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date_desc")

  const { toast } = useToast()

  // Load items from MongoDB
  const loadItems = async () => {
    try {
      setLoading(true)
      const loadedItems = await databaseService.getItems()
      setItems(loadedItems)
    } catch (error) {
      console.error("Error loading items:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los ítems",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort items
  useEffect(() => {
    let filtered = [...items]

    // Apply filters
    if (contentTypeFilter !== "all") {
      filtered = filtered.filter((item) => item.content_type === contentTypeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
        case "date_asc":
          return new Date(a.date_added).getTime() - new Date(b.date_added).getTime()
        case "score_desc":
          return (b.personal_score || 0) - (a.personal_score || 0)
        case "score_asc":
          return (a.personal_score || 0) - (b.personal_score || 0)
        case "title_asc":
          return a.title.localeCompare(b.title)
        case "title_desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    setFilteredItems(filtered)
  }, [items, contentTypeFilter, statusFilter, sortBy])

  useEffect(() => {
    loadItems()
  }, [])

  // Handle form submission
  const handleFormSubmit = async (data: Partial<MediaItem>) => {
    try {
      if (editingItem) {
        // Update existing item
        const updatedItem = await databaseService.updateItem(editingItem.id, data)
        if (updatedItem) {
          toast({
            title: "¡Actualizado!",
            description: "El ítem se actualizó correctamente",
          })
        }
      } else {
        // Create new item
        const newItem = await databaseService.addItem(data)
        if (newItem) {
          toast({
            title: "¡Agregado!",
            description: "El ítem se agregó correctamente",
          })
        }
      }

      loadItems()
      setEditingItem(null)
    } catch (error) {
      console.error("Error saving item:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar el ítem",
        variant: "destructive",
      })
    }
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const success = await databaseService.deleteItem(id)
      if (success) {
        toast({
          title: "¡Eliminado!",
          description: "El ítem se eliminó correctamente",
        })
        loadItems()
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el ítem",
        variant: "destructive",
      })
    }
    setDeleteId(null)
  }

  // Handle export
  const handleExport = () => {
    try {
      const data = JSON.stringify(items, null, 2)
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `media-tracker-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "¡Exportado!",
        description: "Los datos se exportaron correctamente",
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Error",
        description: "No se pudieron exportar los datos",
        variant: "destructive",
      })
    }
  }

  // Handle import
  const handleImport = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = async (e) => {
          try {
            const jsonData = e.target?.result as string
            const itemsToImport = JSON.parse(jsonData) as MediaItem[]
            
            // Import each item to MongoDB
            for (const item of itemsToImport) {
              await databaseService.addItem(item)
            }
            
            loadItems()
            toast({
              title: "¡Importado!",
              description: "Los datos se importaron correctamente",
            })
          } catch (error) {
            console.error("Error importing data:", error)
            toast({
              title: "Error",
              description: "No se pudieron importar los datos",
              variant: "destructive",
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setIsFormOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-pink-700">Cargando tu colección...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-pink-600 fill-pink-600" />
            <h1 className="text-4xl font-bold text-pink-800">Mi Colección</h1>
          </div>
          <p className="text-pink-600 text-lg">Trackea mis animes, películas, series, juegos y álbumes favoritos</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FiltersBar
            contentTypeFilter={contentTypeFilter}
            statusFilter={statusFilter}
            sortBy={sortBy}
            onContentTypeChange={setContentTypeFilter}
            onStatusChange={setStatusFilter}
            onSortChange={setSortBy}
            onAddNew={handleAddNew}
            onExport={handleExport}
            onImport={handleImport}
          />
        </div>

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-pink-100 max-w-md mx-auto">
              <Heart className="h-12 w-12 text-pink-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay ítems que mostrar</h3>
              <p className="text-gray-500 mb-4">
                {items.length === 0
                  ? "Comienza agregando tu primer ítem a la colección"
                  : "No hay ítems que coincidan con los filtros seleccionados"}
              </p>
              <Button onClick={handleAddNew} className="bg-pink-600 hover:bg-pink-700 text-white">
                Agregar primer ítem
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredItems.map((item) => (
              <MediaCard key={item.id} item={item} onEdit={handleEdit} onDelete={(id) => setDeleteId(id)} />
            ))}
          </div>
        )}

        {/* Stats */}
        {items.length > 0 && (
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-pink-100 inline-block">
              <p className="text-pink-700">
                <span className="font-semibold">{filteredItems.length}</span> de{" "}
                <span className="font-semibold">{items.length}</span> ítems mostrados
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <MediaForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingItem(null)
        }}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El ítem será eliminado permanentemente de tu colección.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
