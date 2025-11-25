import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getGuestNameFromURL, getHashFromURL } from "../utils/linkGenerator";
import { saveRSVP, validateRSVPData, getRSVPByHash } from "../firebase/rsvpService";
import { markInvitationAsConfirmed, isHashConfirmed } from "../firebase/invitationService";
import { createComment } from "../firebase/commentsService";

export default function RSVP() {
  const [formData, setFormData] = useState({
    name: "",
    attending: "",
    guests: "1",
    dietary: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previouslyConfirmed, setPreviouslyConfirmed] = useState(false);
  const [hasValidHash, setHasValidHash] = useState(false);

  useEffect(() => {
    const initializeRSVP = async () => {
      // Si hay un nombre en la URL, prellenarlo en el formulario
      const guestName = getGuestNameFromURL();
      const hash = getHashFromURL();

      if (guestName && hash) {
        console.log("📝 RSVP: Prellenando nombre:", guestName);
        setHasValidHash(true);
        setFormData(prev => ({
          ...prev,
          name: guestName
        }));

        // Verificar si ya se confirmó previamente (tanto en invitations como en RSVPs)
        console.log("🔍 RSVP: Verificando confirmación previa para hash:", hash);

        // Primero verificar en RSVPs (más específico)
        const existingRSVP = await getRSVPByHash(hash);
        if (existingRSVP) {
          console.log("✅ RSVP: Ya existe confirmación RSVP para este hash");
          setPreviouslyConfirmed(true);
          return;
        }

        // Si no hay RSVP, verificar en invitations
        const isInvitationConfirmed = await isHashConfirmed(hash);
        if (isInvitationConfirmed) {
          console.log("✅ RSVP: Invitación ya confirmada previamente");
          setPreviouslyConfirmed(true);
        }
      }
    };

    initializeRSVP();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar datos
      const validationErrors = validateRSVPData(formData);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        setLoading(false);
        return;
      }

      // Guardar en Firestore
      console.log("💾 Enviando RSVP a Firestore:", formData);
      const hash = getHashFromURL();
      const rsvpDataWithHash = { ...formData, hash: hash || undefined };
      const rsvpId = await saveRSVP(rsvpDataWithHash);
      console.log("✅ RSVP guardado exitosamente con ID:", rsvpId);

      // Marcar la invitación como confirmada si hay un hash
      if (hash) {
        console.log("🔄 Marcando invitación como confirmada:", hash);
        try {
          await markInvitationAsConfirmed(hash, rsvpId);
          console.log("✅ Invitación marcada como confirmada");
        } catch (confirmError) {
          console.error("⚠️ Error al marcar como confirmada:", confirmError);
          // No mostrar error al usuario, ya que el RSVP se guardó correctamente
        }
      }

      // Si hay mensaje, también crear un comentario
      if (formData.message.trim()) {
        try {
          console.log("💬 Creando comentario con el mensaje del RSVP");
          await createComment(formData.name, formData.message.trim(), "💌");
          console.log("✅ Comentario creado exitosamente");
        } catch (commentError) {
          console.error("⚠️ Error al crear comentario:", commentError);
          // No mostrar error al usuario, ya que el RSVP se guardó correctamente
        }
      }

      setSubmitted(true);
    } catch (error) {
      console.error("❌ Error al enviar RSVP:", error);
      setError(`Error al enviar confirmación: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <motion.section
        className="bg-gradient-to-r from-baby-blue-100 to-celeste-200 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-celeste-400 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          <span className="text-6xl">🎉</span>
        </motion.div>
        <h3 className="text-3xl font-baby text-yellow-600 mt-4 mb-2">
          ¡Gracias!
        </h3>
        <p className="text-gray-700" style={{ color: 'rgb(10, 135, 161)' }}>
          Tu confirmación ha sido recibida. ¡Nos vemos en el baby shower!
        </p>
        <motion.button
          onClick={() => setSubmitted(false)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold border-2 border-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Editar respuesta
        </motion.button>
      </motion.section>
    );
  }

  if (previouslyConfirmed) {
    return (
      <motion.section
        className="bg-gradient-to-r from-green-100 to-emerald-200 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-emerald-400 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, repeat: 2 }}
        >
          <span className="text-6xl">✅</span>
        </motion.div>
        <h3 className="text-3xl font-baby text-emerald-600 mt-4 mb-2">
          Ya confirmaste tu asistencia
        </h3>
        <p className="text-gray-700" style={{ color: 'rgb(10, 135, 161)' }}>
          Hemos recibido tu confirmación previamente. ¡Te esperamos en el baby shower!
        </p>
        <motion.button
          onClick={() => setPreviouslyConfirmed(false)}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-bold border-2 border-emerald-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Actualizar respuesta
        </motion.button>
      </motion.section>
    );
  }

  // Si no hay hash válido, mostrar mensaje informativo
  if (!hasValidHash) {
    return (
      <motion.section
        className="bg-gradient-to-br from-white/95 to-baby-blue-100 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-2"
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
          Confirma tu Asistencia
        </motion.h3>

        <div className="text-center py-8">
          <motion.div
            className="mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-6xl">💌</span>
          </motion.div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h4 className="text-lg font-bold text-yellow-600 mb-3">
              Solo para invitados
            </h4>
            <p className="text-yellow-600 mb-2">
              Para confirmar tu asistencia necesitas usar tu enlace personalizado de invitación.
            </p>
            <p className="text-yellow-500 text-sm">
              Si eres un invitado y no tienes tu enlace, contacta a los organizadores.
            </p>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="bg-gradient-to-br from-white/95 to-baby-blue-100 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-2"
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
        Confirma tu Asistencia
      </motion.h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div>
            <label className="block text-yellow-600 font-medium mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
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
              placeholder={hasValidHash ? "Nombre confirmado" : "Tu nombre"}
            />
          </div>

          <div>
            <label className="block text-yellow-600 font-medium mb-2">
              ¿Asistirás?
            </label>
            <select
              name="attending"
              required
              value={formData.attending}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all"
              style={{ borderColor: "#efbb20" }}
              onFocus={(e) =>
                (e.target.style.boxShadow = "0 0 0 2px rgba(239, 187, 32, 0.3)")
              }
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            >
              <option value="">Selecciona una opción</option>
              <option value="yes">Sí, asistiré 🎉</option>
              <option value="no">No podré asistir 😢</option>
              <option value="maybe">Tal vez 🤔</option>
            </select>
          </div>
        </motion.div>

        {formData.attending === "yes" && (
          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <label className="block text-yellow-600 font-medium mb-2">
                Número de invitados
              </label>
              <select
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all"
                style={{ borderColor: "#efbb20" }}
                onFocus={(e) =>
                  (e.target.style.boxShadow =
                    "0 0 0 2px rgba(239, 187, 32, 0.3)")
                }
                onBlur={(e) => (e.target.style.boxShadow = "none")}
              >
                <option value="1">Solo yo</option>
                <option value="2">2 personas</option>
                <option value="3">3 personas</option>
                <option value="4">4+ personas</option>
              </select>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <label className="block text-yellow-600 font-medium mb-2">
            Mensaje para la futura mamá
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all resize-none"
            style={{ borderColor: "#efbb20" }}
            onFocus={(e) =>
              (e.target.style.boxShadow = "0 0 0 2px rgba(239, 187, 32, 0.3)")
            }
            onBlur={(e) => (e.target.style.boxShadow = "none")}
            placeholder="Escribe un mensaje dulce..."
          />
        </motion.div>

        {/* Mostrar errores si los hay */}
        {error && (
          <motion.div
            className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold transition-all duration-300 shadow-lg border-2 ${
            loading
              ? 'bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 border-blue-700'
          }`}
          whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {loading ? 'Enviando... ⏳' : 'Enviar Confirmación 💌'}
        </motion.button>
      </form>
    </motion.section>
  );
}
