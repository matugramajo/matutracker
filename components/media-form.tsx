"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { type MediaItem, contentTypes, statusOptions } from "@/lib/constants"

interface MediaFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<MediaItem>) => void
  initialData?: MediaItem | null
}

export function MediaForm({ isOpen, onClose, onSubmit, initialData }: MediaFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    cover_url: initialData?.cover_url || "",
    content_type: initialData?.content_type || "",
    status: initialData?.status || "",
    platform: initialData?.platform || "",
    personal_score: initialData?.personal_score?.toString() || "",
    notes: initialData?.notes || "",
    recommended_by: initialData?.recommended_by || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData: Partial<MediaItem> = {
      ...formData,
      content_type: formData.content_type as "anime" | "movie" | "series" | "game" | "album",
      status: formData.status as "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch" | "recommendation",
      personal_score: formData.personal_score ? Number.parseInt(formData.personal_score) : undefined,
      recommended_by: formData.recommended_by || undefined,
    }

    if (initialData) {
      submitData.id = initialData.id
    }

    onSubmit(submitData)
    onClose()

    // Reset form if it's a new item
    if (!initialData) {
      setFormData({
        title: "",
        cover_url: "",
        content_type: "",
        status: "",
        platform: "",
        personal_score: "",
        notes: "",
        recommended_by: "",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-pink-800">{initialData ? "Editar ítem" : "Agregar nuevo ítem"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div>
            <Label htmlFor="cover_url">URL de la portada</Label>
            <Input
              id="cover_url"
              type="url"
              value={formData.cover_url}
              onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="content_type">Tipo de contenido *</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value) => setFormData({ ...formData, content_type: value })}
                required
              >
                <SelectTrigger className="focus:ring-pink-500 focus:border-pink-500">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Estado *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                required
              >
                <SelectTrigger className="focus:ring-pink-500 focus:border-pink-500">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">Plataforma</Label>
              <Input
                id="platform"
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                placeholder="Netflix, Steam, Spotify..."
                className="focus:ring-pink-500 focus:border-pink-500"
              />
            </div>

            <div>
              <Label htmlFor="personal_score">Puntaje personal (1-10)</Label>
              <Input
                id="personal_score"
                type="number"
                min="1"
                max="10"
                value={formData.personal_score}
                onChange={(e) => setFormData({ ...formData, personal_score: e.target.value })}
                className="focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Tus pensamientos sobre este contenido..."
              className="focus:ring-pink-500 focus:border-pink-500"
              rows={3}
            />
          </div>

          {formData.status === "recommendation" && (
            <div>
              <Label htmlFor="recommended_by">Recomendado por *</Label>
              <Input
                id="recommended_by"
                value={formData.recommended_by}
                onChange={(e) => setFormData({ ...formData, recommended_by: e.target.value })}
                placeholder="Nombre de quien te recomendó este contenido"
                className="focus:ring-pink-500 focus:border-pink-500"
                required={formData.status === "recommendation"}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white">
              {initialData ? "Actualizar" : "Agregar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
