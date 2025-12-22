import firebase from 'firebase/compat/app';
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Helper to safely get env vars without crashing if process is undefined
const getEnv = (key: string, fallback: string): string => {
  // 1. Try Vite import.meta
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  // 2. Try Standard Process (if polyfilled)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key.replace('VITE_', '')]) {
      return process.env[key.replace('VITE_', '')] as string;
    }
  } catch (e) {
    // Ignore reference errors
  }
  return fallback;
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY', "AIzaSy..."),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', "your-app.firebaseapp.com"),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID', "your-app"),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', "your-app.appspot.com"),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', "123456789"),
  appId: getEnv('VITE_FIREBASE_APP_ID', "1:123456789:web:abcdef")
};

class FirebaseService {
  private static instance: FirebaseService;
  public app: any;
  public auth: Auth;
  public db: Firestore;
  public googleProvider: GoogleAuthProvider;

  private constructor() {
    if (firebase.apps.length === 0) {
      this.app = firebase.initializeApp(firebaseConfig);
    } else {
      this.app = firebase.apps[0];
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