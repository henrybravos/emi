// Utilidades para generar enlaces personalizados con nombres codificados

// Función para codificar un nombre en un código único (versión única con timestamp)
export const encodeGuestName = (name: string): string => {
  // Agregar timestamp actual para hacer el hash único
  const timestamp = Date.now();
  const nameWithTimestamp = `${name}-${timestamp}`;

  // Crear un código más corto usando base64 URL-safe
  const base64 = btoa(encodeURIComponent(nameWithTimestamp))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  // Crear un hash simple del nombre con timestamp para obfuscación
  const hash = nameWithTimestamp.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  // Usar base36 para hacer el código más corto
  const prefix = Math.abs(hash).toString(36).substring(0, 2);
  const suffix = Math.abs(hash * 7).toString(36).substring(0, 2);

  // Combinar: prefijo + base64 + sufijo
  return prefix + base64 + suffix;
};

// Función para decodificar el código y obtener el nombre original (versión corta)
export const decodeGuestName = (code: string): string => {
  try {
    // Validar longitud mínima (2 prefix + 4 base64 mínimo + 2 suffix)
    if (code.length < 8) {
      return 'Invitado';
    }

    // Extraer la parte del base64 (quitar los 2 caracteres del inicio y final)
    const base64Part = code.substring(2, code.length - 2);

    // Restaurar el base64 válido agregando padding si es necesario
    let base64 = base64Part
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Agregar padding si es necesario
    while (base64.length % 4) {
      base64 += '=';
    }

    // Validar que sea base64 válido
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) {
      return 'Invitado';
    }

    // Decodificar base64
    const decoded = decodeURIComponent(atob(base64));

    return decoded || 'Invitado';
  } catch (error) {
    console.error('Error decodificando nombre:', error);
    return 'Invitado';
  }
};

// Función para generar URL completa
export const generatePersonalizedLink = (guestName: string, baseUrl: string = "https://emi.infira.pe"): string => {
  const code = encodeGuestName(guestName);
  return `${baseUrl}/${code}`;
};

// Función para obtener el nombre desde la URL actual
export const getGuestNameFromURL = (): string | null => {
  const path = window.location.pathname;
  console.log("🔍 getGuestNameFromURL - Path:", path);

  // Si la URL es solo "/" o vacía, no hay código
  if (path === '/' || path === '') {
    console.log("❌ Path vacío o raíz");
    return null;
  }

  // Obtener el código de la URL (quitar el '/' inicial)
  const code = path.substring(1);
  console.log("🔍 Código extraído:", code);
  console.log("🔍 Longitud del código:", code.length);

  // Si el código es muy corto o muy largo, probablemente no es válido
  if (code.length < 8 || code.length > 50) {
    console.log("❌ Código fuera de rango de longitud");
    return null;
  }

  // Intentar decodificar
  console.log("🔄 Intentando decodificar...");
  const name = decodeGuestName(code);
  console.log("🔍 Resultado de decodificación:", name);

  // Si el resultado es "Invitado" (valor por defecto), retornar null
  const result = name === 'Invitado' ? null : name;
  console.log("🔍 Resultado final:", result);
  return result;
};

// Función para obtener solo el hash desde la URL
export const getHashFromURL = (): string | null => {
  const path = window.location.pathname;

  // Si la URL es solo "/" o vacía, no hay código
  if (path === '/' || path === '') {
    return null;
  }

  // Obtener el código de la URL (quitar el '/' inicial)
  const code = path.substring(1);

  // Si el código es muy corto o muy largo, probablemente no es válido
  if (code.length < 8 || code.length > 50) {
    return null;
  }

  return code;
};

// Función para obtener mensaje personalizado
export const getPersonalizedMessage = (guestName: string): string => {
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