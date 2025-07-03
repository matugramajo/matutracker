import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Comment } from "@/lib/constants"

interface CommentsModalProps {
  mediaItemId: string
  title: string
  onClose: () => void
  onCommentAdded?: () => void
}

export function CommentsModal({ mediaItemId, title, onClose, onCommentAdded }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const fetchComments = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/comments?mediaItemId=${mediaItemId}`)
      const data = await res.json()
      setComments(Array.isArray(data) ? data : [])
    } catch {
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line
  }, [mediaItemId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!text.trim()) {
      setError("El comentario no puede estar vacío.")
      return
    }
    if (text.length > 500) {
      setError("El comentario no puede superar los 500 caracteres.")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaItemId, name: name.trim() || undefined, text: text.trim() })
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Error al enviar el comentario")
      } else {
        setText("")
        setName("")
        fetchComments()
        if (onCommentAdded) onCommentAdded()
      }
    } catch {
      setError("Error al enviar el comentario")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-pink-800">Comentarios sobre "{title}"</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-2">
            <Input
              placeholder="Tu nombre (opcional)"
              value={name}
              maxLength={100}
              onChange={e => setName(e.target.value)}
              className="focus:ring-pink-500 focus:border-pink-500"
            />
            <Textarea
              placeholder="Escribe tu comentario..."
              value={text}
              maxLength={500}
              onChange={e => setText(e.target.value)}
              rows={3}
              className="focus:ring-pink-500 focus:border-pink-500"
              required
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{text.length}/500 caracteres</span>
              {error && <span className="text-red-500">{error}</span>}
            </div>
            <Button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white w-full"
              disabled={submitting}
            >
              {submitting ? "Enviando..." : "Agregar comentario"}
            </Button>
          </form>
          <div className="border-t border-pink-100 pt-4">
            {loading ? (
              <div className="text-center text-pink-500">Cargando comentarios...</div>
            ) : comments.length === 0 ? (
              <div className="text-center text-gray-400">Aún no hay comentarios.</div>
            ) : (
              <ul className="space-y-4">
                {comments.map((c) => {
                  const isLong = c.text.length > 120
                  const isExpanded = expanded[c._id]
                  return (
                    <li key={c._id} className="bg-pink-50 rounded-lg p-3">
                      <div className="text-sm text-gray-700 whitespace-pre-line break-words max-w-full">
                        {isLong && !isExpanded ? c.text.slice(0, 120) + '...' : c.text}
                        {isLong && (
                          <button
                            className="ml-2 text-pink-600 hover:underline text-xs font-medium"
                            onClick={() => setExpanded(e => ({ ...e, [c._id]: !isExpanded }))}
                          >
                            {isExpanded ? 'Ver menos' : 'Ver más'}
                          </button>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-pink-700 font-medium">
                          {c.name ? c.name : "Anónimo"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(c.createdAt).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {c.likedByMe ? (
                          <button
                            className="text-xs text-pink-600 hover:text-pink-800 font-semibold focus:outline-none flex items-center"
                            onClick={async () => {
                              const res = await fetch(`/api/comments/${c._id}/like`, { method: 'DELETE' })
                              if (res.ok) {
                                const data = await res.json()
                                setComments(comments => comments.map(com => com._id === c._id ? { ...com, likesCount: data.likesCount, likedByMe: false } : com))
                              }
                            }}
                            aria-label="Quitar like"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" width={16} height={16} className="mr-1"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                            Quitar like ({c.likesCount})
                          </button>
                        ) : (
                          <button
                            className="flex items-center text-pink-600 hover:text-pink-800 text-xs font-semibold focus:outline-none"
                            onClick={async () => {
                              const res = await fetch(`/api/comments/${c._id}/like`, { method: 'POST' })
                              if (res.ok) {
                                const data = await res.json()
                                setComments(comments => comments.map(com => com._id === c._id ? { ...com, likesCount: data.likesCount, likedByMe: true } : com))
                              }
                            }}
                            aria-label="Dar like"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" width={16} height={16} className="mr-1"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
                            Like ({c.likesCount})
                          </button>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 