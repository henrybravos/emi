import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  createInvitation,
  getAllInvitations,
  type InvitationResponse,
} from "../firebase/invitationService";
import MessagesForMama from "./MessagesForMama";

export default function InvitationManagerContent() {
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
  const [showInvitations, setShowInvitations] = useState(true);

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleCreateInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      alert("El nombre del invitado es requerido");
      return;
    }

    setLoading(true);

    try {
      const invitation = await createInvitation(
        guestName.trim(),
        email.trim(),
        phone.trim()
      );

      // Generar mensaje de WhatsApp automáticamente
      const whatsappMessage = `🎉👶 ¡BABY SHOWER DE EMILIANO! 👶🎉

¡Hola ${invitation.guestName}! 💕

Estamos muy felices por la llegada de nuestro bebé Emiliano y queremos que acompañes a celebrar su baby shower 🍼✨

📅 Fecha: 29 de Noviembre
⏰ Hora: 3:30 PM
📍 Lugar: Jr Alfonso Ugarte, San Marcos
🗺️ Ubicación: https://maps.app.goo.gl/p53dGvGxV5W3PGBm8

🎈 Tu presencia hará este día aún más especial 🎈

Confirma tu asistencia aquí 👇
${invitation.linkUrl}

¡Te esperamos! 🥳💙`;

      // Copiar automáticamente al portapapeles
      try {
        await navigator.clipboard.writeText(whatsappMessage);
        alert(
          `¡Invitación creada para ${invitation.guestName}! 🎉\n\nEl mensaje de WhatsApp ya está copiado en tu portapapeles 📱✨\n\n¡Solo pégalo y envía! 📤`
        );
      } catch (clipboardError) {
        // Fallback si no funciona clipboard
        const textArea = document.createElement("textarea");
        textArea.value = whatsappMessage;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert(
          `¡Invitación creada para ${invitation.guestName}! 🎉\n\nEl mensaje de WhatsApp está copiado en tu portapapeles 📱✨`
        );
      }

      // Limpiar formulario
      setGuestName("");
      setEmail("");
      setPhone("");

      // Recargar lista de invitaciones
      await loadInvitations();
    } catch (error) {
      console.error("Error al crear invitación:", error);
      alert("Error al crear la invitación. Inténtalo de nuevo.");
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

  const copyWhatsAppMessage = async (invitation: InvitationResponse) => {
    const whatsappMessage = `🎉👶 ¡BABY SHOWER DE EMILIANO! 👶🎉

¡Hola ${invitation.guestName}! 💕

Estamos muy felices por la llegada de nuestro bebé Emiliano y queremos que acompañes a celebrar su baby shower 🍼✨

📅 Fecha: 29 de Noviembre
⏰ Hora: 3:30 PM
📍 Lugar: Jr Alfonso Ugarte, San Marcos
🗺️ Ubicación: https://maps.app.goo.gl/p53dGvGxV5W3PGBm8

🎈 Tu presencia hará este día aún más especial 🎈

Confirma tu asistencia aquí 👇
${invitation.linkUrl}

¡Te esperamos! 🥳💙`;

    try {
      await navigator.clipboard.writeText(whatsappMessage);
      alert("¡Mensaje de WhatsApp copiado al portapapeles! 📱💬\n\n¡Listo para enviar!");
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = whatsappMessage;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("¡Mensaje de WhatsApp copiado! 📱💬");
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulario para crear invitación */}
      <motion.div
        className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2"
        style={{ borderColor: "#efbb20" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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

          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-bold transition-all border-2 ${
              loading
                ? "bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 border-blue-700"
            }`}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? "Creando... ⏳" : "Crear Invitación ✨"}
          </motion.button>
        </form>
      </motion.div>

      {/* Lista de invitaciones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
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
            className="space-y-3 max-h-96 overflow-y-auto"
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
                  <div className="flex-1">
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
                    <p className="text-xs text-gray-500 mt-1 break-all">
                      🔗 {invitation.linkUrl}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => copyWhatsAppMessage(invitation)}
                    className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📱 Copiar WhatsApp
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
      </motion.div>

      {/* Mensajes para la mamá */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <MessagesForMama />
      </motion.div>
    </div>
  );
}
