import { useState } from "react";
import { motion } from "framer-motion";
import { verifyAdminPassword } from "../firebase/authService";

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Ingresa la contraseña");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const isValid = await verifyAdminPassword(password.trim());

      if (isValid) {
        // Guardar en localStorage que el usuario está autenticado
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminAuthTime", Date.now().toString());
        onSuccess();
      } else {
        setError("Contraseña incorrecta");
      }
    } catch (error) {
      console.error("Error en autenticación:", error);
      setError("Error al verificar contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-cyan-100 to-teal-200 min-h-screen flex items-center justify-center">
      <motion.div
        className="bg-white rounded-2xl p-8 shadow-2xl border-2 max-w-md w-full mx-4"
        style={{ borderColor: '#efbb20' }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔐
          </motion.div>
          <h2 className="text-2xl font-bold text-yellow-600 mb-2">
            Acceso de Administrador
          </h2>
          <p className="text-gray-600" style={{ color: 'rgb(10, 135, 161)' }}>
            Ingresa la contraseña para acceder al panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-yellow-600 font-medium mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-all text-center text-lg tracking-wider"
              style={{ borderColor: "#efbb20" }}
              onFocus={(e) =>
                (e.target.style.boxShadow = "0 0 0 2px rgba(239, 187, 32, 0.3)")
              }
              onBlur={(e) => (e.target.style.boxShadow = "none")}
              placeholder="••••••"
              maxLength={6}
              autoFocus
            />
          </div>

          {error && (
            <motion.div
              className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center"
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
          >
            {loading ? 'Verificando... 🔄' : 'Acceder 🚀'}
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
          >
            ← Volver al inicio
          </a>
        </div>
      </motion.div>
    </div>
  );
}