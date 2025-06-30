"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Star, ChevronDown, ChevronUp } from "lucide-react"
import { type MediaItem, contentTypes, statusOptions } from "@/lib/constants"

interface MediaCardProps {
  item: MediaItem
  onEdit: (item: MediaItem) => void
  onDelete: (id: string) => void
}

export function MediaCard({ item, onEdit, onDelete }: MediaCardProps) {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false)
  
  const contentTypeLabel = contentTypes.find((ct) => ct.value === item.content_type)?.label
  const statusLabel = statusOptions.find((s) => s.value === item.status)?.label

  const getStatusColor = (status: string) => {
    switch (status) {
      case "watching":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "on_hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "dropped":
        return "bg-red-100 text-red-800 border-red-200"
      case "plan_to_watch":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Función para determinar si las notas son largas (más de 100 caracteres)
  const isNotesLong = item.notes && item.notes.length > 100

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-pink-100 hover:border-pink-200">
      <CardContent className="p-4">
        <div className="relative mb-3">
          <Image
            src={item.cover_url || "/placeholder.svg?height=300&width=200"}
            alt={item.title}
            width={200}
            height={300}
            className="w-full h-48 object-cover rounded-lg bg-pink-50"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-500"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem]">{item.title}</h3>

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs bg-pink-50 text-pink-700 border-pink-200">
              {contentTypeLabel}
            </Badge>
            <Badge variant="outline" className={`text-xs ${getStatusColor(item.status)}`}>
              {statusLabel}
            </Badge>
          </div>

          {item.platform && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Plataforma:</span> {item.platform}
            </p>
          )}

          {item.personal_score && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-pink-400 text-pink-400" />
              <span className="text-sm font-medium text-gray-700">{item.personal_score}/10</span>
            </div>
          )}

          {item.notes && (
            <div className="space-y-1">
              <p className={`text-sm text-gray-600 ${!isNotesExpanded && isNotesLong ? 'line-clamp-2' : ''}`}>
                {item.notes}
              </p>
              {isNotesLong && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                  onClick={() => setIsNotesExpanded(!isNotesExpanded)}
                >
                  {isNotesExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Ver menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Ver más
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          <p className="text-xs text-gray-500">Agregado: {new Date(item.date_added).toLocaleDateString("es-ES")}</p>
        </div>
      </CardContent>
    </Card>
  )
}
