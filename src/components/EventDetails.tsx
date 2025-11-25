import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import decorationImg from "../assets/decoration.gif";
import addressImg from "../assets/address.png";

export default function EventDetails() {
  const [showZoom, setShowZoom] = useState(false);
  return (
    <motion.section
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border-2 relative"
      style={{ borderColor: "#efbb20" }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      whileHover={{ y: -2, boxShadow: "0 25px 50px rgba(239, 187, 32, 0.15)" }}
    >
      {/* Decorative image overlay */}
      <motion.img
        src={decorationImg}
        alt="Baby shower decoration"
        className="absolute -top-48 -left-24 w-60 h-60 md:w-80 md:h-80 object-contain opacity-80 pointer-events-none z-10"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 0.8 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      />
      <motion.h3
        className="text-3xl font-baby text-yellow-600 mb-6 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Detalles del Evento
      </motion.h3>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          className="space-y-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📅</span>
            <div>
              <p className="font-semibold text-yellow-600">Fecha</p>
              <p
                className="text-gray-600"
                style={{ color: "rgb(10, 135, 161)" }}
              >
                Sábado, 29 de Noviembre
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-semibold text-yellow-600">Hora</p>
              <p
                className="text-gray-600"
                style={{ color: "rgb(10, 135, 161)" }}
              >
                3:30 PM
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-semibold text-yellow-600">Ubicación</p>
                <a
                  href="https://maps.app.goo.gl/p53dGvGxV5W3PGBm8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Jr alfonso Ugarte, San Marcos
                </a>
                <p
                  className="text-sm text-gray-600"
                  style={{ color: "rgb(10, 135, 161)" }}
                >
                  (una cuadra antes de llegar puente colgante)
                </p>
              </div>
            </div>

            <motion.div
              className="mt-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="space-y-2">
                <motion.img
                  src={addressImg}
                  alt="Mapa de ubicación - Click para hacer zoom"
                  className="w-full max-w-sm mx-auto rounded-lg shadow-md border hover:shadow-lg transition-all duration-300 cursor-pointer"
                  style={{ borderColor: "#efbb20" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowZoom(true)}
                />
                <a
                  href="https://maps.app.goo.gl/p53dGvGxV5W3PGBm8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 hover:text-blue-800 underline font-medium text-sm"
                >
                  📍 Abrir en Google Maps
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="mt-8 p-4 bg-baby-blue-50 rounded-lg border-l-4"
        style={{ borderLeftColor: "#efbb20" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <p className="text-yellow-600 font-medium">Nota especial:</p>
        <p
          className="text-gray-600 mt-1"
          style={{ color: "rgb(10, 135, 161)" }}
        >
          ¡Trae tu cámara! Queremos capturar todos los momentos especiales
          juntos.
        </p>
      </motion.div>

      {/* Modal de zoom para la imagen */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowZoom(false)}
          >
            <motion.div
              className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="p-4 bg-gradient-to-r from-baby-blue-100 to-celeste-100 border-b"
                style={{ borderColor: "#efbb20" }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-yellow-600">
                    Mapa de Ubicación
                  </h3>
                  <div className="flex space-x-2">
                    <a
                      href="https://maps.app.goo.gl/p53dGvGxV5W3PGBm8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      📱 Abrir en Google Maps
                    </a>
                    <button
                      onClick={() => setShowZoom(false)}
                      className="bg-gray-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                    >
                      ✕ Cerrar
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <img
                  src={addressImg}
                  alt="Mapa de ubicación en tamaño completo"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
