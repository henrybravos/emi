import { collection, addDoc, Timestamp, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from './config';

export interface RSVPData {
  name: string;
  attending: string;
  guests: string;
  dietary: string;
  message: string;
  hash?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface RSVPResponse extends RSVPData {
  id: string;
}

// Colección de RSVPs en Firestore
const RSVP_COLLECTION = 'rsvps';

// Función para guardar RSVP con validación de hash
export const saveRSVP = async (rsvpData: Omit<RSVPData, 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log('💾 Guardando RSVP en Firestore:', rsvpData);

    // Validar que tenga hash (usuario válido)
    if (!rsvpData.hash) {
      throw new Error('Hash de invitación requerido');
    }

    // Verificar si ya existe un RSVP con este hash o nombre
    const existingRSVP = await getRSVPByHash(rsvpData.hash) || await getRSVPByName(rsvpData.name);

    if (existingRSVP) {
      // Actualizar RSVP existente
      console.log('📝 Actualizando RSVP existente');
      await updateRSVP(existingRSVP.id, rsvpData);
      return existingRSVP.id;
    } else {
      // Crear nuevo RSVP
      console.log('✨ Creando nuevo RSVP');
      const docRef = await addDoc(collection(db, RSVP_COLLECTION), {
        ...rsvpData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      console.log('✅ RSVP guardado con ID:', docRef.id);
      return docRef.id;
    }
  } catch (error) {
    console.error('❌ Error al guardar RSVP:', error);
    throw new Error(`Error al guardar confirmación: ${error}`);
  }
};

// Función para actualizar RSVP existente
export const updateRSVP = async (id: string, rsvpData: Omit<RSVPData, 'createdAt' | 'updatedAt'>): Promise<void> => {
  try {
    const docRef = doc(db, RSVP_COLLECTION, id);
    await updateDoc(docRef, {
      ...rsvpData,
      updatedAt: Timestamp.now(),
    });
    console.log('✅ RSVP actualizado exitosamente');
  } catch (error) {
    console.error('❌ Error al actualizar RSVP:', error);
    throw new Error(`Error al actualizar confirmación: ${error}`);
  }
};

// Función para obtener RSVP por hash
export const getRSVPByHash = async (hash: string): Promise<RSVPResponse | null> => {
  try {
    const q = query(
      collection(db, RSVP_COLLECTION),
      where('hash', '==', hash)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as RSVPResponse;
  } catch (error) {
    console.error('❌ Error al buscar RSVP por hash:', error);
    return null;
  }
};

// Función para obtener RSVP por nombre
export const getRSVPByName = async (name: string): Promise<RSVPResponse | null> => {
  try {
    const q = query(
      collection(db, RSVP_COLLECTION),
      where('name', '==', name)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as RSVPResponse;
  } catch (error) {
    console.error('❌ Error al buscar RSVP por nombre:', error);
    return null;
  }
};

// Función para obtener todos los RSVPs
export const getAllRSVPs = async (): Promise<RSVPResponse[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, RSVP_COLLECTION));
    const rsvps: RSVPResponse[] = [];

    querySnapshot.forEach((doc) => {
      rsvps.push({
        id: doc.id,
        ...doc.data()
      } as RSVPResponse);
    });

    console.log('📋 RSVPs obtenidos:', rsvps.length);
    return rsvps;
  } catch (error) {
    console.error('❌ Error al obtener RSVPs:', error);
    throw new Error(`Error al obtener confirmaciones: ${error}`);
  }
};

// Función para validar datos de RSVP
export const validateRSVPData = (rsvpData: Omit<RSVPData, 'createdAt' | 'updatedAt'>): string[] => {
  const errors: string[] = [];

  if (!rsvpData.name.trim()) {
    errors.push('El nombre es requerido');
  }

  if (!rsvpData.attending) {
    errors.push('Debes confirmar si asistirás o no');
  }

  if (!rsvpData.guests || parseInt(rsvpData.guests) < 1) {
    errors.push('El número de invitados debe ser al menos 1');
  }

  return errors;
};