import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAllComments, timestampToDate } from "../firebase/commentsService";

interface Comment {
  id: string;
  author: string;
  message: string;
  timestamp: Date;
  emoji: string;
}

export default function MessagesForMama() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const firebaseComments = await getAllComments();
      // Convertir CommentResponse a Comment
      const convertedComments: Comment[] = firebaseComments.map((comment) => ({
        id: comment.id,
        author: comment.author,
        message: comment.message,
        emoji: comment.emoji,
        timestamp: timestampToDate(comment.timestamp),
      }));
      setComments(convertedComments);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Hace menos de 1 hora";
    if (diffInHours === 1) return "Hace 1 hora";
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Hace 1 día";
    return `Hace ${diffInDays} días`;
  };

  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-yellow-600">
          💌 Mensajes para la Mamá ({comments.length})
        </h3>
        <motion.button
          onClick={loadComments}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? "⏳ Cargando..." : "🔄 Recargar"}
        </motion.button>
      </div>

      {/* Messages List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loading ? (
          <div
            className="text-center py-8"
            style={{ color: "rgb(10, 135, 161)" }}
          >
            <div className="animate-spin text-2xl mb-2">⏳</div>
            <p>Cargando mensajes...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              className="p-4 bg-white border rounded-lg shadow-sm"
              style={{ borderColor: "#efbb20" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{comment.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-yellow-600">
                      {comment.author}
                    </h4>
                    <div className="text-right">
                      <span
                        className="text-sm text-gray-500 block"
                        style={{ color: "rgb(10, 135, 161)" }}
                      >
                        {formatTimeAgo(comment.timestamp)}
                      </span>
                      <span
                        className="text-xs text-gray-400"
                        style={{ color: "rgb(10, 135, 161)" }}
                      >
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg"
                    style={{ color: "rgb(10, 135, 161)" }}
                  >
                    "{comment.message}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div
            className="text-center py-8"
            style={{ color: "rgb(10, 135, 161)" }}
          >
            <span className="text-4xl block mb-2">💭</span>
            <p>Aún no hay mensajes para la mamá</p>
          </div>
        )}
      </div>
    </div>
  );
}
