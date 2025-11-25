import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export interface UploadResult {
  id: string;
  url: string;
  name: string;
  size: number;
}

export const uploadPhotos = async (files: File[]): Promise<UploadResult[]> => {
  const uploadPromises = files.map(async (file) => {
    // Crear nombre único para el archivo
    const fileName = `baby-shower/${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name}`;

    // Crear referencia al archivo en Storage
    const storageRef = ref(storage, fileName);

    try {
      // Subir archivo
      const snapshot = await uploadBytes(storageRef, file);

      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        id: snapshot.ref.name,
        url: downloadURL,
        name: file.name,
        size: file.size
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error(`Error al subir ${file.name}: ${error}`);
    }
  });

  // Ejecutar todas las subidas en paralelo
  return Promise.all(uploadPromises);
};

// Función para validar archivos antes de subir
export const validateFiles = (files: File[]): string[] => {
  const errors: string[] = [];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  files.forEach(file => {
    if (file.size > maxSize) {
      errors.push(`${file.name} es demasiado grande (máx 5MB)`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name} no es un formato de imagen válido`);
    }
  });

  return errors;
};