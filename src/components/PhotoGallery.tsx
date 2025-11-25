import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";

// Import images from assets
import img1 from "../assets/IMG_7817.jpeg";
import img2 from "../assets/IMG_7832.jpeg";
import img3 from "../assets/IMG_7836.jpeg";
import img4 from "../assets/IMG_7867.jpeg";
import img5 from "../assets/IMG_7877.jpeg";

interface Photo {
  id: string;
  url: string;
  name: string;
}

// Photos to display
const photos: Photo[] = [
  { id: "sample1", url: img1, name: "IMG_7817.jpeg" },
  { id: "sample2", url: img2, name: "IMG_7832.jpeg" },
  { id: "sample3", url: img3, name: "IMG_7836.jpeg" },
  { id: "sample4", url: img4, name: "IMG_7867.jpeg" },
  { id: "sample5", url: img5, name: "IMG_7877.jpeg" },
];

export default function PhotoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (info.offset.x < -threshold && currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const nextPhoto = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <motion.section
      className="bg-gradient-to-br from-white/95 to-celeste-100 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border-2"
      style={{ borderColor: '#efbb20' }}
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
        Galería de Recuerdos 📸
      </motion.h3>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, height: "auto" }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-medium text-yellow-600">
            Momentos especiales
          </h4>
          <span className="text-sm" style={{ color: 'rgb(10, 135, 161)' }}>
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <motion.div
            className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => handleSwipe(info)}
            whileTap={{ cursor: "grabbing" }}
          >
            <AnimatePresence mode="popLayout">
              <motion.img
                key={photos[currentIndex]?.id}
                src={photos[currentIndex]?.url}
                alt={photos[currentIndex]?.name}
                className="w-full h-full object-cover absolute inset-0"
                initial={{ x: 300, opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              />
            </AnimatePresence>

            {/* Navigation buttons */}
            {currentIndex > 0 && (
              <motion.button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors font-bold border-2 border-blue-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </motion.button>
            )}

            {currentIndex < photos.length - 1 && (
              <motion.button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors font-bold border-2 border-blue-700"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                →
              </motion.button>
            )}
          </motion.div>

          {/* Photo indicators */}
          {photos.length > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              {photos.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "shadow-lg"
                      : "hover:scale-110"
                  }`}
                  style={{
                    backgroundColor: index === currentIndex ? '#efbb20' : 'rgb(203, 213, 225)',
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 text-sm mt-4" style={{ color: 'rgb(10, 135, 161)' }}>
          Desliza para ver más fotos o usa las flechas
        </p>
      </motion.div>
    </motion.section>
  );
}