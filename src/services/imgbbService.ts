export interface ImgBBUploadResult {
  id: string;
  url: string;
  name: string;
  size: number;
  deleteUrl?: string;
}

// API Key de ImgBB (reemplaza con tu API key)
const IMGBB_API_KEY = 'TU_API_KEY_AQUI';
const IMGBB_API_URL = 'https://api.imgbb.com/1/upload';

export const uploadToImgBB = async (files: File[]): Promise<ImgBBUploadResult[]> => {
  if (!IMGBB_API_KEY || IMGBB_API_KEY === 'TU_API_KEY_AQUI') {
    throw new Error('API Key de ImgBB no configurada. Ve a https://imgbb.com/login para obtener una gratis');
  }

  const uploadPromises = files.map(async (file) => {
    // Crear FormData para el upload
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);
    formData.append('name', file.name.replace(/\.[^/.]+$/, "")); // Nombre sin extensión

    try {
      const response = await fetch(IMGBB_API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Error desconocido de ImgBB');
      }

      return {
        id: result.data.id,
        url: result.data.url,
        name: file.name,
        size: file.size,
        deleteUrl: result.data.delete_url
      };
    } catch (error) {
      console.error('Error uploading to ImgBB:', error);
      throw new Error(`Error al subir ${file.name}: ${error}`);
    }
  });

  // Ejecutar todas las subidas en paralelo
  return Promise.all(uploadPromises);
};

// Función para validar archivos antes de subir
export const validateFiles = (files: File[]): string[] => {
  const errors: string[] = [];
  const maxSize = 32 * 1024 * 1024; // 32MB (límite de ImgBB)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];

  files.forEach(file => {
    if (file.size > maxSize) {
      errors.push(`${file.name} es demasiado grande (máx 32MB)`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name} no es un formato de imagen válido`);
    }
  });

  return errors;
};