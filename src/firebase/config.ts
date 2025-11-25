import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuración de Firebase para baby-shower-emi
const firebaseConfig = {
  apiKey: "AIzaSyDdqo21hzBr9gDVHXkbL7y-G73dnTHrNHM",
  authDomain: "emi-baby.firebaseapp.com",
  projectId: "emi-baby",
  storageBucket: "emi-baby.firebasestorage.app",
  messagingSenderId: "57301073624",
  appId: "1:57301073624:web:435a4ce0bea06a5c9521ad",
  measurementId: "G-KXGCNS2SLM"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Storage
export const storage = getStorage(app);

// Inicializar Firestore
export const db = getFirestore(app);

// Inicializar Analytics (opcional)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;