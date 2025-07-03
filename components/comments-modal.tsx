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

// Utilidad para construir árbol de comentarios
function buildCommentTree(comments: Comment[]): any[] {
  const map: Record<string, any> = {};
  const roots: any[] = [];
  comments.forEach(c => { map[c._id] = { ...c, replies: [] } });
  comments.forEach(c => {
    if (c.parentId && map[c.parentId]) {
      map[c.parentId].replies.push(map[c._id]);
    } else {
      roots.push(map[c._id]);
    }
  });
  return roots;
}

function CommentItem({ comment, onReply, onLike, onUnlike, replyingId, setReplyingId, addReply, depth = 0 }: any) {
  const [showAllReplies, setShowAllReplies] = useState(false);
  const repliesToShow = showAllReplies ? comment.replies : comment.replies.slice(0, 1);
  const hasMoreReplies = comment.replies.length > 1 && !showAllReplies;
  const [replyText, setReplyText] = useState("");
  const [replyName, setReplyName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReply = async (e: any) => {
    e.preventDefault();
    setError(null);
    if (!replyText.trim()) {
      setError("La respuesta no puede estar vacía.");
      return;
    }
    setSubmitting(true);
    await addReply(comment._id, replyName, replyText);
    setReplyText("");
    setReplyName("");
    setReplyingId(null);
    setSubmitting(false);
  };

  return (
    <li className={`bg-pink-50 rounded-lg p-3 mt-2 ml-${depth * 4}`}>
      <div className="text-sm text-gray-700 whitespace-pre-line break-words max-w-full">
        {comment.text}
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-pink-700 font-medium">
          {comment.name ? comment.name : "Anónimo"}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(comment.createdAt).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        {comment.likedByMe ? (
          <button
            className="text-xs text-pink-600 hover:text-pink-800 font-semibold focus:outline-none flex items-center"
            onClick={() => onUnlike(comment._id)}
            aria-label="Quitar like"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" width={16} height={16} className="mr-1"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
            Quitar like ({comment.likesCount})
          </button>
        ) : (
          <button
            className="flex items-center text-pink-600 hover:text-pink-800 text-xs font-semibold focus:outline-none"
            onClick={() => onLike(comment._id)}
            aria-label="Dar like"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" width={16} height={16} className="mr-1"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>
            Like ({comment.likesCount})
          </button>
        )}
        <button
          className="text-xs text-pink-500 hover:underline ml-2"
          onClick={() => setReplyingId(replyingId === comment._id ? null : comment._id)}
        >
          Responder
        </button>
      </div>
      {replyingId === comment._id && (
        <form onSubmit={handleReply} className="mt-2 space-y-1">
          <Input
            placeholder="Tu nombre (opcional)"
            value={replyName}
            maxLength={100}
            onChange={e => setReplyName(e.target.value)}
            className="focus:ring-pink-500 focus:border-pink-500"
          />
          <Textarea
            placeholder="Escribe tu respuesta..."
            value={replyText}
            maxLength={500}
            onChange={e => setReplyText(e.target.value)}
            rows={2}
            className="focus:ring-pink-500 focus:border-pink-500"
            required
          />
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{replyText.length}/500 caracteres</span>
            {error && <span className="text-red-500">{error}</span>}
          </div>
          <Button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white"
            disabled={submitting}
          >
            {submitting ? "Enviando..." : "Responder"}
          </Button>
        </form>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <ul className="ml-4 mt-2">
          {repliesToShow.map((reply: any) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onUnlike={onUnlike}
              replyingId={replyingId}
              setReplyingId={setReplyingId}
              addReply={addReply}
              depth={depth + 1}
            />
          ))}
          {hasMoreReplies && (
            <button
              className="text-xs text-pink-500 hover:underline mt-1"
              onClick={() => setShowAllReplies(true)}
            >
              Ver más respuestas ({comment.replies.length - 1})
            </button>
          )}
          {showAllReplies && comment.replies.length > 1 && (
            <button
              className="text-xs text-pink-400 hover:underline mt-1"
              onClick={() => setShowAllReplies(false)}
            >
              Ocultar respuestas
            </button>
          )}
        </ul>
      )}
    </li>
  );
}

export function CommentsModal({ mediaItemId, title, onClose, onCommentAdded }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [text, setText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [replyingId, setReplyingId] = useState<string | null>(null);

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

  const addReply = async (parentId: string, name: string, text: string) => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaItemId, name: name.trim() || undefined, text: text.trim(), parentId })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al enviar la respuesta");
      } else {
        fetchComments();
      }
    } catch {
      setError("Error al enviar la respuesta");
    } finally {
      setSubmitting(false);
    }
  };

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
                {buildCommentTree(comments).map((c) => (
                  <CommentItem
                    key={c._id}
                    comment={c}
                    onReply={() => setReplyingId(c._id)}
                    onLike={async (id: string) => {
                      const res = await fetch(`/api/comments/${id}/like`, { method: 'POST' });
                      if (res.ok) {
                        const data = await res.json();
                        setComments(comments => comments.map(com => com._id === id ? { ...com, likesCount: data.likesCount, likedByMe: true } : com));
                      }
                    }}
                    onUnlike={async (id: string) => {
                      const res = await fetch(`/api/comments/${id}/like`, { method: 'DELETE' });
                      if (res.ok) {
                        const data = await res.json();
                        setComments(comments => comments.map(com => com._id === id ? { ...com, likesCount: data.likesCount, likedByMe: false } : com));
                      }
                    }}
                    replyingId={replyingId}
                    setReplyingId={setReplyingId}
                    addReply={addReply}
                  />
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 