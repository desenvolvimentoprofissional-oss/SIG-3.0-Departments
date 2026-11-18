import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, setPersistence, inMemoryPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string
};

export const app = firebaseConfig.apiKey ? initializeApp(firebaseConfig) : null as any;
export const centralDb = app ? getFirestore(app) : null as any;
export const storage = app ? getStorage(app) : null as any;
export const auth = app ? getAuth(app) : null as any;

if (auth) {
  setPersistence(auth, inMemoryPersistence).catch(() => console.error("[AUTH] - Operation aborted due to communication failure or infrastructure response."));
}

