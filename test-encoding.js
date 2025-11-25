// Test para verificar la codificación y decodificación

// Función para codificar un nombre en un código único (misma que en linkGenerator.ts)
const encodeGuestName = (name) => {
  const base64 = btoa(encodeURIComponent(name));

  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  const prefix = Math.abs(hash).toString(36).substring(0, 3);
  const suffix = Math.abs(hash * 7).toString(36).substring(0, 3);

  const combined = prefix + base64 + suffix;
  return Array.from(combined)
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
};

// Función para decodificar (misma que en linkGenerator.ts)
const decodeGuestName = (code) => {
  try {
    if (code.length % 2 !== 0) {
      return 'Invitado';
    }

    const chars = [];
    for (let i = 0; i < code.length; i += 2) {
      const hex = code.substring(i, i + 2);
      const charCode = parseInt(hex, 16);
      if (!isNaN(charCode)) {
        chars.push(String.fromCharCode(charCode));
      }
    }

    const combined = chars.join('');

    if (combined.length < 6) {
      return 'Invitado';
    }

    const base64 = combined.substring(3, combined.length - 3);

    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
      return 'Invitado';
    }

    const decoded = decodeURIComponent(atob(base64));
    return decoded || 'Invitado';
  } catch (error) {
    console.error('Error decodificando:', error);
    return 'Invitado';
  }
};

// Test
const originalName = "Henry Bravo";
const encoded = encodeGuestName(originalName);
const decoded = decodeGuestName(encoded);

console.log("=".repeat(50));
console.log("🧪 TEST DE CODIFICACIÓN/DECODIFICACIÓN");
console.log("=".repeat(50));
console.log("Original:", originalName);
console.log("Codificado:", encoded);
console.log("Decodificado:", decoded);
console.log("¿Funciona?", originalName === decoded ? "✅ SÍ" : "❌ NO");
console.log("=".repeat(50));

// Test con el código generado anteriormente
const testCode = "77393453475675636e6b6c4d6a4243636d463262773d3d363972";
const testDecoded = decodeGuestName(testCode);
console.log("Test código anterior:", testCode);
console.log("Resultado:", testDecoded);
console.log("=".repeat(50));