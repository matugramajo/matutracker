"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Star, ChevronDown, ChevronUp, MessageCircle } from "lucide-react"
import { type MediaItem, contentTypes, statusOptions } from "@/lib/constants"
import { CommentsModal } from "@/components/comments-modal"

interface MediaCardProps {
  item: MediaItem
  commentCount?: number
}

export function MediaCard({ item, commentCount }: MediaCardProps) {
  const [isNotesExpanded, setIsNotesExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [localCount, setLocalCount] = useState(commentCount ?? 0)
  useEffect(() => { setLocalCount(commentCount ?? 0) }, [commentCount])
  
  // Estado local para likes
  const [likesCount, setLikesCount] = useState(item.likesCount ?? 0)
  const [likedByMe, setLikedByMe] = useState(!!item.likedByMe)

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
      case "recommendation":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Función para determinar si las notas son largas (más de 100 caracteres)
  const isNotesLong = item.notes && item.notes.length > 100

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-pink-100 hover:border-pink-200 h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="relative mb-3">
          {item.cover_url && item.cover_url.toLowerCase().endsWith('.gif') ? (
            <img
              src={item.cover_url}
              alt={item.title}
              width={200}
              height={300}
              className="w-full h-48 object-cover rounded-lg bg-pink-50"
            />
          ) : (
            <Image
              src={item.cover_url || "/placeholder.svg?height=300&width=200"}
              alt={item.title}
              width={200}
              height={300}
              className="w-full h-48 object-cover rounded-lg bg-pink-50"
            />
          )}
        </div>
        <div className="space-y-2 flex-1">
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

          {item.status === "recommendation" && item.recommended_by && (
            <p className="text-sm text-purple-600">
              <span className="font-medium">Recomendado por:</span> {item.recommended_by}
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
        <div className="mt-4 flex items-center gap-4">
          <button
            className="flex items-center gap-1 text-pink-600 hover:text-pink-800 text-sm font-medium"
            onClick={() => setShowComments(true)}
          >
            <MessageCircle className="h-4 w-4" /> Ver comentarios ({localCount})
          </button>
          {typeof likesCount === 'number' && (
            likedByMe ? (
              <button
                className="flex items-center gap-1 text-pink-600 hover:text-pink-800 text-sm font-medium"
                onClick={async () => {
                  const res = await fetch(`/api/media/${item.id}/like`, { method: 'DELETE' })
                  if (res.ok) {
                    const data = await res.json()
                    setLikesCount(data.likesCount)
                    setLikedByMe(false)
                  }
                }}
                aria-label="Quitar like"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" width={16} height={16}><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                Quitar like ({likesCount})
              </button>
            ) : (
              <button
                className="flex items-center gap-1 text-pink-600 hover:text-pink-800 text-sm font-medium"
                onClick={async () => {
                  const res = await fetch(`/api/media/${item.id}/like`, { method: 'POST' })
                  if (res.ok) {
                    const data = await res.json()
                    setLikesCount(data.likesCount)
                    setLikedByMe(true)
                  }
                }}
                aria-label="Dar like"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" width={16} height={16}><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                Like ({likesCount})
              </button>
            )
          )}
        </div>
      </CardContent>
      {showComments && (
        <CommentsModal
          mediaItemId={item.id}
          title={item.title}
          onClose={() => setShowComments(false)}
          onCommentAdded={() => setLocalCount(c => c + 1)}
        />
      )}
    </Card>
  )
}
