import { collection, addDoc, getDocs, query, where, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from './config';
import { encodeGuestName } from '../utils/linkGenerator';

export interface InvitationData {
  guestName: string;
  email?: string;
  phone?: string;
  hash: string;
  linkUrl: string;
  hasConfirmed: boolean;
  rsvpId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface InvitationResponse extends InvitationData {
  id: string;
}

// Colección de invitaciones en Firestore
const INVITATIONS_COLLECTION = 'invitations';

// Función para crear una invitación
export const createInvitation = async (
  guestName: string,
  email?: string,
  phone?: string,
  baseUrl: string = window.location.origin
): Promise<InvitationResponse> => {
  try {
    console.log('✨ Creando invitación para:', guestName);

    // Verificar si ya existe una invitación para este invitado
    const existingInvitation = await getInvitationByName(guestName);
    if (existingInvitation) {
      console.log('📝 Ya existe invitación, actualizando...');
      await updateDoc(doc(db, INVITATIONS_COLLECTION, existingInvitation.id), {
        email: email || existingInvitation.email,
        phone: phone || existingInvitation.phone,
        updatedAt: Timestamp.now(),
      });
      return {
        ...existingInvitation,
        email: email || existingInvitation.email,
        phone: phone || existingInvitation.phone,
      };
    }

    // Generar hash y URL
    const hash = encodeGuestName(guestName);
    const linkUrl = `${baseUrl}/${hash}`;

    const invitationData: Omit<InvitationData, 'id'> = {
      guestName,
      email: email || '',
      phone: phone || '',
      hash,
      linkUrl,
      hasConfirmed: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Guardar en Firestore
    const docRef = await addDoc(collection(db, INVITATIONS_COLLECTION), invitationData);

    console.log('✅ Invitación creada con ID:', docRef.id);

    return {
      id: docRef.id,
      ...invitationData,
    };
  } catch (error) {
    console.error('❌ Error al crear invitación:', error);
    throw new Error(`Error al crear invitación: ${error}`);
  }
};

// Función para obtener invitación por nombre
export const getInvitationByName = async (guestName: string): Promise<InvitationResponse | null> => {
  try {
    const q = query(
      collection(db, INVITATIONS_COLLECTION),
      where('guestName', '==', guestName)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as InvitationResponse;
  } catch (error) {
    console.error('❌ Error al buscar invitación por nombre:', error);
    return null;
  }
};

// Función para obtener invitación por hash
export const getInvitationByHash = async (hash: string): Promise<InvitationResponse | null> => {
  try {
    const q = query(
      collection(db, INVITATIONS_COLLECTION),
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
    } as InvitationResponse;
  } catch (error) {
    console.error('❌ Error al buscar invitación por hash:', error);
    return null;
  }
};

// Función para marcar invitación como confirmada
export const markInvitationAsConfirmed = async (hash: string, rsvpId: string): Promise<void> => {
  try {
    const invitation = await getInvitationByHash(hash);
    if (invitation) {
      await updateDoc(doc(db, INVITATIONS_COLLECTION, invitation.id), {
        hasConfirmed: true,
        rsvpId,
        updatedAt: Timestamp.now(),
      });
      console.log('✅ Invitación marcada como confirmada');
    }
  } catch (error) {
    console.error('❌ Error al marcar invitación como confirmada:', error);
    throw error;
  }
};

// Función para obtener todas las invitaciones
export const getAllInvitations = async (): Promise<InvitationResponse[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, INVITATIONS_COLLECTION));
    const invitations: InvitationResponse[] = [];

    querySnapshot.forEach((doc) => {
      invitations.push({
        id: doc.id,
        ...doc.data()
      } as InvitationResponse);
    });

    console.log('📋 Invitaciones obtenidas:', invitations.length);
    return invitations;
  } catch (error) {
    console.error('❌ Error al obtener invitaciones:', error);
    throw new Error(`Error al obtener invitaciones: ${error}`);
  }
};

// Función para verificar si un hash ya está confirmado
export const isHashConfirmed = async (hash: string): Promise<boolean> => {
  try {
    const invitation = await getInvitationByHash(hash);
    return invitation ? invitation.hasConfirmed : false;
  } catch (error) {
    console.error('❌ Error al verificar confirmación:', error);
    return false;
  }
};