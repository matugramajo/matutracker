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
}

export function CommentsModal({ mediaItemId, title, onClose }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
                {comments.map((c) => (
                  <li key={c._id} className="bg-pink-50 rounded-lg p-3">
                    <div className="text-sm text-gray-700 whitespace-pre-line">{c.text}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-pink-700 font-medium">
                        {c.name ? c.name : "Anónimo"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(c.createdAt).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 