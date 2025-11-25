import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';

// Colección para contraseñas de admin
const ADMIN_COLLECTION = 'admin_passwords';

// Función para verificar contraseña de admin
export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  try {
    console.log('🔐 Verificando contraseña de admin...');

    // Buscar la contraseña en Firestore
    const q = query(
      collection(db, ADMIN_COLLECTION),
      where('password', '==', password),
      where('active', '==', true)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log('✅ Contraseña de admin válida');
      return true;
    } else {
      console.log('❌ Contraseña de admin inválida');
      return false;
    }
  } catch (error) {
    console.error('❌ Error al verificar contraseña de admin:', error);
    return false;
  }
};

// Función para crear la contraseña de admin (solo para inicialización)
export const initializeAdminPassword = async (): Promise<void> => {
  try {
    // Esta función solo se usaría una vez para crear la contraseña en Firestore
    // No la incluyo en la interfaz de usuario por seguridad
    console.log('⚠️ Función de inicialización - solo para desarrollo');
  } catch (error) {
    console.error('❌ Error al inicializar contraseña:', error);
  }
};