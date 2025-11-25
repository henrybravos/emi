import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createInvitation,
  getAllInvitations,
  type InvitationResponse,
} from "../firebase/invitationService";
import MessagesForMama from "./MessagesForMama";

export default function InvitationManager() {
  const [isVisible, setIsVisible] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
  const [showInvitations, setShowInvitations] = useState(false);

  // Listener global para el código secreto
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        setIsVisible((prev) => !prev);
        if (!isVisible) {
          loadInvitations();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isVisible]);

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError("El nombre del invitado es requerido");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const invitation = await createInvitation(
        guestName.trim(),
        email.trim(),
        phone.trim()
      );
      setSuccess(
        `✅ Invitación creada exitosamente para ${invitation.guestName}`
      );

      // Limpiar formulario
      setGuestName("");
      setEmail("");
      setPhone("");

      // Recargar lista de invitaciones
      await loadInvitations();
    } catch (error) {
      console.error("Error al crear invitación:", error);
      setError(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const loadInvitations = async () => {
    try {
      const allInvitations = await getAllInvitations();
      setInvitations(allInvitations);
    } catch (error) {
      console.error("Error al cargar invitaciones:", error);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setSuccess("¡Enlace copiado al portapapeles! 📋");
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setSuccess("¡Enlace copiado! 📋");
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-2xl border-2 max-h-[90vh] overflow-y-auto"
              style={{ borderColor: "#efbb20" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-yellow-600 mb-2">
                  👑 Panel de Administración
                </h2>
                <p className="text-sm" style={{ color: "rgb(10, 135, 161)" }}>
                  Gestiona las invitaciones del baby shower
                </p>
              </div>

              {/* Formulario para crear invitación */}
              <motion.div
                className="mb-8 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2"
                style={{ borderColor: "#efbb20" }}
              >
                <h3 className="text-xl font-bold text-yellow-600 mb-4">
                  ✨ Crear Nueva Invitación
                </h3>

                <form onSubmit={handleCreateInvitation} className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-yellow-600 font-medium mb-2">
                        Nombre del invitado *
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Ej: Henry Bravo"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all"
                        style={{ borderColor: "#efbb20" }}
                        onFocus={(e) =>
                          (e.target.style.boxShadow =
                            "0 0 0 2px rgba(239, 187, 32, 0.3)")
                        }
                        onBlur={(e) => (e.target.style.boxShadow = "none")}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 py-3 px-6 rounded-lg font-bold transition-all border-2 ${
                        loading
                          ? "bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 border-blue-700"
                      }`}
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                    >
                      {loading ? "Creando... ⏳" : "Crear Invitación ✨"}
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={clearMessages}
                      className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Limpiar
                    </motion.button>
                  </div>
                </form>
              </motion.div>

              {/* Mensajes de estado */}
              {error && (
                <motion.div
                  className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {success}
                </motion.div>
              )}

              {/* Lista de invitaciones */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-yellow-600">
                    📋 Invitaciones ({invitations.length})
                  </h3>
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => setShowInvitations(!showInvitations)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {showInvitations ? "Ocultar" : "Mostrar"}
                    </motion.button>
                    <motion.button
                      onClick={loadInvitations}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      🔄 Recargar
                    </motion.button>
                  </div>
                </div>

                {showInvitations && (
                  <motion.div
                    className="space-y-3 max-h-64 overflow-y-auto"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {invitations.map((invitation) => (
                      <motion.div
                        key={invitation.id}
                        className="p-4 bg-white border rounded-lg shadow-sm"
                        style={{ borderColor: "#efbb20" }}
                        whileHover={{ y: -1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-yellow-600">
                              {invitation.guestName}
                              {invitation.hasConfirmed && (
                                <span className="ml-2 text-green-600 text-sm">
                                  ✅ Confirmado
                                </span>
                              )}
                            </h4>
                            <p
                              className="text-sm"
                              style={{ color: "rgb(10, 135, 161)" }}
                            >
                              {invitation.email && `📧 ${invitation.email}`}
                              {invitation.phone && ` • 📱 ${invitation.phone}`}
                            </p>
                          </div>
                          <motion.button
                            onClick={() => copyToClipboard(invitation.linkUrl)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            📋 Copiar enlace
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}

                    {invitations.length === 0 && (
                      <div
                        className="text-center py-8"
                        style={{ color: "rgb(10, 135, 161)" }}
                      >
                        No hay invitaciones creadas aún
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Mensajes para la mamá */}
              <div className="mb-6">
                <MessagesForMama />
              </div>

              {/* Botón cerrar */}
              <motion.button
                onClick={() => setIsVisible(false)}
                className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-bold"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cerrar Panel
              </motion.button>

              {/* Instrucciones */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  💡 Tip: Usa Ctrl+Shift+I para abrir/cerrar este panel
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
