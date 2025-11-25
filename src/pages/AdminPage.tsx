import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InvitationManagerContent from '../components/InvitationManagerContent';
import AdminLogin from '../components/AdminLogin';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const checkAuth = () => {
      const authStatus = localStorage.getItem("adminAuth");
      const authTime = localStorage.getItem("adminAuthTime");

      if (authStatus === "true" && authTime) {
        const timeElapsed = Date.now() - parseInt(authTime);
        // Sesión válida por 24 horas (86400000 ms)
        if (timeElapsed < 86400000) {
          setIsAuthenticated(true);
        } else {
          // Sesión expirada
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminAuthTime");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminAuthTime");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-cyan-100 to-teal-200 min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="bg-gradient-to-br from-cyan-100 to-teal-200 min-h-screen relative overflow-hidden">
      {/* Background elements similar to main page */}
      <div className="absolute top-0 left-0 w-full h-48 pointer-events-none z-0">
        {/* Simple cloud for admin page */}
        <motion.div
          animate={{ x: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 left-4 opacity-70"
        >
          <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
            <ellipse cx="30" cy="40" rx="25" ry="15" fill="white" />
            <ellipse cx="50" cy="30" rx="30" ry="18" fill="white" />
            <ellipse cx="75" cy="35" rx="25" ry="15" fill="white" />
            <ellipse cx="95" cy="45" rx="20" ry="12" fill="white" />
          </svg>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-yellow-600 mb-2">
            👑 Panel de Administración
          </h1>
          <p className="text-lg mb-4" style={{ color: 'rgb(10, 135, 161)' }}>
            Gestiona las invitaciones del baby shower de Emiliano
          </p>
          <div className="flex space-x-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold border-2 border-blue-700"
            >
              ← Volver al inicio
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold border-2 border-red-700"
            >
              🔐 Cerrar sesión
            </button>
          </div>
        </motion.div>

        {/* Invitation Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl p-6 shadow-2xl border-2 max-w-6xl mx-auto" style={{ borderColor: '#efbb20' }}>
            <InvitationManagerContent />
          </div>
        </motion.div>
      </div>
    </div>
  );
}