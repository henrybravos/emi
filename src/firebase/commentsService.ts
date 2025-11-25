import { collection, addDoc, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface CommentData {
  author: string;
  message: string;
  emoji: string;
  timestamp: Timestamp;
}

export interface CommentResponse extends CommentData {
  id: string;
}

// Colección de comentarios en Firestore
const COMMENTS_COLLECTION = 'comments';

// Función para crear un comentario
export const createComment = async (
  author: string,
  message: string,
  emoji: string
): Promise<CommentResponse> => {
  try {
    console.log('✨ Creando comentario para:', author);

    const commentData: CommentData = {
      author: author.trim(),
      message: message.trim(),
      emoji,
      timestamp: Timestamp.now(),
    };

    // Guardar en Firestore
    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), commentData);

    console.log('✅ Comentario creado con ID:', docRef.id);

    return {
      id: docRef.id,
      ...commentData,
    };
  } catch (error) {
    console.error('❌ Error al crear comentario:', error);
    throw new Error(`Error al crear comentario: ${error}`);
  }
};

// Función para obtener todos los comentarios
export const getAllComments = async (): Promise<CommentResponse[]> => {
  try {
    // Crear consulta ordenada por timestamp descendente (más recientes primero)
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const comments: CommentResponse[] = [];

    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      } as CommentResponse);
    });

    console.log('📋 Comentarios obtenidos:', comments.length);
    return comments;
  } catch (error) {
    console.error('❌ Error al obtener comentarios:', error);
    throw new Error(`Error al obtener comentarios: ${error}`);
  }
};

// Función para convertir Timestamp a Date
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};