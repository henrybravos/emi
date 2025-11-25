import { collection, addDoc, getDocs, orderBy, query, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from './config';

export interface CommentData {
  author: string;
  message: string;
  emoji: string;
  timestamp: Timestamp;
  reactions: {
    likes: { count: number; users: string[] };
    loves: { count: number; users: string[] };
    excited: { count: number; users: string[] };
    happy: { count: number; users: string[] };
  };
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
      reactions: {
        likes: { count: 0, users: [] },
        loves: { count: 0, users: [] },
        excited: { count: 0, users: [] },
        happy: { count: 0, users: [] },
      },
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

// Tipos de reacciones disponibles
export type ReactionType = 'likes' | 'loves' | 'excited' | 'happy';

// Función para agregar o quitar reacción a un comentario
export const toggleReaction = async (
  commentId: string,
  reactionType: ReactionType,
  userName: string
): Promise<void> => {
  try {
    console.log(`🔄 Toggling ${reactionType} para comentario ${commentId} por ${userName}`);

    // Obtener el comentario actual
    const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
    const comments = await getAllComments();
    const comment = comments.find(c => c.id === commentId);

    if (!comment) {
      throw new Error('Comentario no encontrado');
    }

    const reactions = comment.reactions || {
      likes: { count: 0, users: [] },
      loves: { count: 0, users: [] },
      excited: { count: 0, users: [] }
    };

    const currentReaction = reactions[reactionType];
    const hasReacted = currentReaction.users.includes(userName);

    // Verificar si el usuario ya tiene otra reacción en este comentario
    const existingReactionType = Object.keys(reactions).find((type) =>
      reactions[type as ReactionType].users.includes(userName)
    ) as ReactionType | undefined;

    let newReactions = { ...reactions };

    if (hasReacted) {
      // Quitar reacción actual (toggle off)
      newReactions[reactionType] = {
        count: Math.max(0, currentReaction.count - 1),
        users: currentReaction.users.filter(user => user !== userName)
      };
    } else {
      // Si ya tiene otra reacción, quitarla primero
      if (existingReactionType && existingReactionType !== reactionType) {
        newReactions[existingReactionType] = {
          count: Math.max(0, newReactions[existingReactionType].count - 1),
          users: newReactions[existingReactionType].users.filter(user => user !== userName)
        };
      }

      // Agregar nueva reacción
      newReactions[reactionType] = {
        count: currentReaction.count + 1,
        users: [...currentReaction.users, userName]
      };
    }

    // Actualizar en Firestore
    await updateDoc(commentRef, {
      reactions: newReactions
    });

    console.log(`✅ Reacción ${reactionType} ${hasReacted ? 'quitada' : 'agregada'} exitosamente`);
  } catch (error) {
    console.error('❌ Error al actualizar reacción:', error);
    throw new Error(`Error al actualizar reacción: ${error}`);
  }
};

// Función para verificar si un usuario ya reaccionó con un tipo específico
export const hasUserReacted = (comment: CommentResponse, userName: string, reactionType: ReactionType): boolean => {
  const reactions = comment.reactions || {
    likes: { count: 0, users: [] },
    loves: { count: 0, users: [] },
    excited: { count: 0, users: [] }
  };
  return reactions[reactionType]?.users.includes(userName) || false;
};

// Función para obtener el tipo de reacción actual del usuario
export const getUserReactionType = (comment: CommentResponse, userName: string): ReactionType | null => {
  const reactions = comment.reactions || {
    likes: { count: 0, users: [] },
    loves: { count: 0, users: [] },
    excited: { count: 0, users: [] }
  };

  for (const [type, reaction] of Object.entries(reactions)) {
    if (reaction.users.includes(userName)) {
      return type as ReactionType;
    }
  }
  return null;
};

// Función para convertir Timestamp a Date
export const timestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};