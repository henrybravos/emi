import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createComment,
  getAllComments,
  timestampToDate,
} from "../firebase/commentsService";
import { getGuestNameFromURL, getHashFromURL } from "../utils/linkGenerator";
import { getInvitationByHash } from "../firebase/invitationService";

interface Comment {
  id: string;
  author: string;
  message: string;
  timestamp: Date;
  emoji: string;
}

const babyEmojis = ["👶", "🍼", "🧸", "🎈", "💕", "🌟", "🎀", "💙", "💗", "✨"];

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({
    author: "",
    message: "",
    emoji: "👶",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasValidHash, setHasValidHash] = useState(false);

  // Cargar comentarios al iniciar y verificar hash válido
  useEffect(() => {
    const initializeComments = async () => {
      loadComments();

      // Verificar si el usuario tiene un hash válido y la invitación existe
      const guestName = getGuestNameFromURL();
      const hash = getHashFromURL();

      if (guestName && hash) {
        // Verificar si la invitación aún existe
        const invitation = await getInvitationByHash(hash);

        if (invitation) {
          setHasValidHash(true);
          setNewComment(prev => ({
            ...prev,
            author: guestName
          }));
        } else {
          console.log("❌ Comments: Invitación no encontrada o eliminada");
          setHasValidHash(false);
        }
      }
    };

    initializeComments();
  }, []);

  const loadComments = async () => {
    try {
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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author.trim() || !newComment.message.trim()) return;

    setLoading(true);

    try {
      await createComment(
        newComment.author.trim(),
        newComment.message.trim(),
        newComment.emoji
      );

      // Recargar comentarios
      await loadComments();

      // Limpiar formulario
      setNewComment({ author: "", message: "", emoji: "👶" });
      setShowForm(false);
    } catch (error) {
      console.error("Error al crear comentario:", error);
      alert("Error al publicar el comentario. Inténtalo de nuevo.");
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

  return (
    <motion.section
      className="bg-gradient-to-tl from-white/95 to-baby-blue-100 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-2"
      style={{ borderColor: "#efbb20" }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h3
        className="text-3xl font-baby text-yellow-600 mb-6 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Mensajes y Buenos Deseos 💌
      </motion.h3>

      {/* Add Comment Button - Solo para usuarios con hash válido */}
      {hasValidHash ? (
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg border-2 border-blue-700"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {showForm ? "Cancelar" : "Escribir Mensaje"} ✍️
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="text-center mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="text-yellow-600 text-sm">
            💌 Solo los invitados pueden escribir mensajes
          </p>
          <p className="text-yellow-500 text-xs mt-1">
            Usa tu enlace personalizado para dejar un mensaje
          </p>
        </motion.div>
      )}

      {/* Comment Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            className="mb-8 p-6 bg-baby-blue-50 rounded-xl border"
            style={{ borderColor: "#efbb20" }}
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-yellow-600 font-medium mb-2">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={newComment.author}
                    onChange={(e) =>
                      setNewComment({ ...newComment, author: e.target.value })
                    }
                    disabled={hasValidHash}
                    className={`w-full px-4 py-2 border rounded-lg transition-all ${
                      hasValidHash
                        ? 'bg-gray-100 cursor-not-allowed focus:outline-none'
                        : 'focus:outline-none'
                    }`}
                    style={{
                      borderColor: "#efbb20",
                      opacity: hasValidHash ? 0.7 : 1
                    }}
                    onFocus={(e) => {
                      if (!hasValidHash) {
                        e.target.style.boxShadow = "0 0 0 2px rgba(239, 187, 32, 0.3)";
                      }
                    }}
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                    placeholder={hasValidHash ? "Nombre confirmado" : "¿Cómo te llamas?"}
                  />
                </div>

                <div>
                  <label className="block text-yellow-600 font-medium mb-2">
                    Emoji
                  </label>
                  <select
                    value={newComment.emoji}
                    onChange={(e) =>
                      setNewComment({ ...newComment, emoji: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all"
                    style={{ borderColor: "#efbb20" }}
                    onFocus={(e) =>
                      (e.target.style.boxShadow =
                        "0 0 0 2px rgba(239, 187, 32, 0.3)")
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                  >
                    {babyEmojis.map((emoji) => (
                      <option key={emoji} value={emoji}>
                        {emoji}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-yellow-600 font-medium mb-2">
                  Tu mensaje
                </label>
                <textarea
                  required
                  rows={4}
                  value={newComment.message}
                  onChange={(e) =>
                    setNewComment({ ...newComment, message: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all resize-none"
                  style={{ borderColor: "#efbb20" }}
                  onFocus={(e) =>
                    (e.target.style.boxShadow =
                      "0 0 0 2px rgba(239, 187, 32, 0.3)")
                  }
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                  placeholder="Escribe un mensaje bonito para la futura mamá..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg font-bold transition-colors border-2 ${
                  loading
                    ? "bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 border-blue-700"
                }`}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? "Publicando... ⏳" : "Publicar Mensaje 💕"}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              className="bg-white/60 rounded-xl p-4 border shadow-sm"
              style={{ borderColor: "#efbb20" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              layout
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start space-x-3">
                <motion.span
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                >
                  {comment.emoji}
                </motion.span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-yellow-600">
                      {comment.author}
                    </h4>
                    <span
                      className="text-sm text-gray-500"
                      style={{ color: "rgb(10, 135, 161)" }}
                    >
                      {formatTimeAgo(comment.timestamp)}
                    </span>
                  </div>
                  <p
                    className="text-gray-700 leading-relaxed"
                    style={{ color: "rgb(10, 135, 161)" }}
                  >
                    {comment.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {comments.length === 0 && (
        <motion.div
          className="text-center py-8 text-gray-500"
          style={{ color: "rgb(10, 135, 161)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <span className="text-4xl block mb-2">💭</span>
          <p>Aún no hay mensajes. ¡Sé el primero en escribir!</p>
        </motion.div>
      )}
    </motion.section>
  );
}
