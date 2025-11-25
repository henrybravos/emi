import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePersonalizedLink, getPersonalizedMessage } from '../utils/linkGenerator';

export default function LinkGenerator() {
  const [isVisible, setIsVisible] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');

  const handleGenerateLink = () => {
    if (!guestName.trim()) {
      alert('Por favor ingresa un nombre');
      return;
    }

    const link = generatePersonalizedLink(guestName.trim());
    const message = getPersonalizedMessage(guestName.trim());

    setGeneratedLink(link);
    setPreviewMessage(message);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      alert('¡Enlace copiado al portapapeles! 📋');
    } catch (error) {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = generatedLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('¡Enlace copiado! 📋');
    }
  };

  const clearFields = () => {
    setGuestName('');
    setGeneratedLink('');
    setPreviewMessage('');
  };

  // Código secreto para mostrar el componente
  const handleSecretCode = (e: React.KeyboardEvent) => {
    const secretKeys = ['g', 'e', 'n']; // Teclas: g-e-n
    const key = e.key.toLowerCase();

    if (secretKeys.includes(key)) {
      setTimeout(() => setIsVisible(true), 100);
    }
  };

  // Agregar listener global para el código secreto
  useState(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  return (
    <>
      {/* Botón oculto para activar (solo visible con Ctrl+Shift+G) */}
      {!isVisible && (
        <div
          className="fixed bottom-4 right-4 opacity-0 hover:opacity-20 transition-opacity z-50"
          onKeyDown={handleSecretCode}
          tabIndex={0}
        >
          <button
            onClick={() => setIsVisible(true)}
            className="w-8 h-8 bg-transparent"
            title="Generador de Enlaces (Ctrl+Shift+G)"
          />
        </div>
      )}

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
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-2"
              style={{ borderColor: '#efbb20' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-yellow-600 mb-2">
                  🔗 Generador de Enlaces Personalizados
                </h3>
                <p className="text-sm" style={{ color: 'rgb(10, 135, 161)' }}>
                  Crea enlaces únicos para cada invitado
                </p>
              </div>

              <div className="space-y-4">
                {/* Input para nombre */}
                <div>
                  <label className="block text-yellow-600 font-medium mb-2">
                    Nombre del invitado:
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerateLink()}
                    placeholder="Ej: Henry Bravo"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none transition-all"
                    style={{ borderColor: '#efbb20' }}
                    onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(239, 187, 32, 0.3)'}
                    onBlur={(e) => e.target.style.boxShadow = 'none'}
                  />
                </div>

                {/* Botones */}
                <div className="flex space-x-2">
                  <motion.button
                    onClick={handleGenerateLink}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all border-2 border-blue-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Generar Enlace
                  </motion.button>

                  <motion.button
                    onClick={clearFields}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Limpiar
                  </motion.button>
                </div>

                {/* Enlace generado */}
                {generatedLink && (
                  <motion.div
                    className="mt-6 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border"
                    style={{ borderColor: '#efbb20' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="text-yellow-600 font-medium mb-2">
                      🎉 Enlace personalizado:
                    </p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={generatedLink}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border rounded text-sm"
                        style={{ borderColor: '#efbb20' }}
                      />
                      <motion.button
                        onClick={copyToClipboard}
                        className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        📋
                      </motion.button>
                    </div>

                    {/* Preview del mensaje */}
                    {previewMessage && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <p className="text-xs font-medium text-yellow-600 mb-1">
                          Vista previa del mensaje:
                        </p>
                        <p className="text-sm" style={{ color: 'rgb(10, 135, 161)' }}>
                          {previewMessage}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Botón cerrar */}
              <motion.button
                onClick={() => setIsVisible(false)}
                className="w-full mt-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cerrar
              </motion.button>

              {/* Instrucciones */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  💡 Tip: Usa Ctrl+Shift+G para abrir/cerrar
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}