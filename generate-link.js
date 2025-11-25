// Script temporal para generar enlace de Henry Bravo

// Función para codificar un nombre en un código único (versión corregida)
const encodeGuestName = (name) => {
  // Método más simple y confiable
  const base64 = btoa(encodeURIComponent(name));

  // Crear un hash simple del nombre para consistencia
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  // Usar el hash para crear caracteres adicionales consistentes
  const prefix = Math.abs(hash).toString(36).substring(0, 3);
  const suffix = Math.abs(hash * 7).toString(36).substring(0, 3);

  // Combinar y convertir a hex
  const combined = prefix + base64 + suffix;
  return Array.from(combined)
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
};

// Función para obtener mensaje personalizado
const getPersonalizedMessage = (guestName) => {
  const messages = [
    `¡Hola ${guestName}! Te esperamos en este día tan especial 💕`,
    `${guestName}, tu presencia hará este momento aún más especial ✨`,
    `¡${guestName}! Estamos emocionados de celebrar contigo 🎈`,
    `Querido/a ${guestName}, este día será inolvidable con tu compañía 🌟`,
    `${guestName}, ven a celebrar la llegada de nuestro pequeño tesoro 👶`
  ];

  // Seleccionar mensaje basado en el hash del nombre (para consistencia)
  const hash = guestName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  const index = Math.abs(hash) % messages.length;
  return messages[index];
};

// Generar enlace para Henry Bravo
const guestName = "Henry Bravo";
const baseUrl = "http://localhost:5174";
const code = encodeGuestName(guestName);
const personalizedLink = `${baseUrl}/${code}`;
const message = getPersonalizedMessage(guestName);

console.log("=".repeat(60));
console.log("🎉 INVITACIÓN PERSONALIZADA GENERADA");
console.log("=".repeat(60));
console.log();
console.log("👤 Invitado:", guestName);
console.log("🔗 Enlace personalizado:", personalizedLink);
console.log("💌 Mensaje personalizado:", message);
console.log();
console.log("=".repeat(60));
console.log("📋 INSTRUCCIONES:");
console.log("1. Copia el enlace y envíalo a Henry Bravo");
console.log("2. Cuando Henry abra el enlace verá el mensaje personalizado");
console.log("3. La página detectará automáticamente su nombre");
console.log("=".repeat(60));