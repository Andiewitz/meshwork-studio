import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Configuration handles both Vite (import.meta.env) and standard process.env if needed, 
// though Vite requires VITE_ prefix for client exposure.
// We use (import.meta as any).env to avoid TypeScript errors if the Vite types aren't loaded.
const env = (import.meta as any).env;

const firebaseConfig = {
  apiKey: env?.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "AIzaSy...",
  authDomain: env?.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || "your-app.firebaseapp.com",
  projectId: env?.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "your-app",
  storageBucket: env?.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "your-app.appspot.com",
  messagingSenderId: env?.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: env?.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

class FirebaseService {
  private static instance: FirebaseService;
  public app: FirebaseApp;
  public auth: Auth;
  public db: Firestore;
  public googleProvider: GoogleAuthProvider;

  private constructor() {
    if (getApps().length === 0) {
      this.app = initializeApp(firebaseConfig);
    } else {
      this.app = getApps()[0];
    }
    
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.googleProvider = new GoogleAuthProvider();
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }
}

export const firebaseService = FirebaseService.getInstance();
export const auth = firebaseService.auth;
export const db = firebaseService.db;
export const googleProvider = firebaseService.googleProvider;