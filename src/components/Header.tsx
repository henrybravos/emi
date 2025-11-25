import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getGuestNameFromURL, getPersonalizedMessage } from "../utils/linkGenerator";

export default function Header() {
  const [guestName, setGuestName] = useState<string | null>(null);
  const [personalizedMessage, setPersonalizedMessage] = useState<string | null>(null);

  useEffect(() => {
    // Obtener nombre del invitado desde la URL
    console.log("🔍 Header: Verificando URL para nombre de invitado");
    console.log("🔍 Pathname actual:", window.location.pathname);

    const name = getGuestNameFromURL();
    console.log("🔍 Nombre decodificado:", name);

    if (name) {
      console.log("✅ Nombre encontrado, configurando mensaje personalizado");
      setGuestName(name);
      const message = getPersonalizedMessage(name);
      console.log("💌 Mensaje generado:", message);
      setPersonalizedMessage(message);
    } else {
      console.log("❌ No se encontró nombre en la URL");
    }
  }, []);
  return (
    <header className="text-center py-2">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <motion.div
          className="relative text-center mb-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.h1
            className="text-7xl md:text-9xl drop-shadow-lg"
            style={{
              color: "#0a87a1",
              fontFamily: "Dancing Script, cursive",
              fontWeight: "700",
              lineHeight: "0.7",
            }}
          >
            Baby
          </motion.h1>

          {/* Baby footprints positioned between Baby and Shower */}
          <motion.div
            className="text-3xl mt-5 mb-0"
            style={{
              filter: "brightness(0) invert(1)",
            }}
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: -15 }}
            transition={{ delay: 1, duration: 0.8, type: "spring" }}
          >
            👣
          </motion.div>

          <motion.h1
            className="text-7xl md:text-9xl drop-shadow-lg"
            style={{
              color: "#0a87a1",
              fontFamily: "Dancing Script, cursive",
              fontWeight: "700",
              lineHeight: "0.7",
            }}
          >
            Shower
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-baby-blue-300 to-celeste-300 mx-auto rounded-full mb-4"
        />

        <motion.h2
          className="text-2xl md:text-3xl font-bold drop-shadow-md"
          style={{
            color: "#0a87a1",
            fontFamily: "Comfortaa, Poppins, sans-serif",
            fontWeight: "600",
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Celebremos la llegada de nuestro bebé
        </motion.h2>

        <motion.h3
          className="text-6xl md:text-8xl font-bold drop-shadow-lg mt-2"
          style={{
            color: "#efbb20",
            fontFamily: "Dancing Script, cursive",
            fontWeight: "700",
            lineHeight: "0.9",
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          Emiliano
        </motion.h3>

        {/* Mensaje personalizado para el invitado */}
        {guestName && personalizedMessage && (
          <motion.div
            className="mt-6 mx-auto max-w-2xl px-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <motion.div
              className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 border-2 shadow-lg"
              style={{ borderColor: '#efbb20' }}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p
                className="text-lg md:text-xl font-medium text-center"
                style={{
                  color: 'rgb(10, 135, 161)',
                  fontFamily: "Comfortaa, Poppins, sans-serif",
                }}
              >
                {personalizedMessage}
              </p>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </header>
  );
}
