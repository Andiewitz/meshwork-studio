/**
 * FIREBASE SERVICE (DECOMMISSIONED)
 * This service is currently mocked to bypass the "Component auth has not been registered yet" error.
 * Local storage is used for persistence in the interim.
 * See to-do.md for restoration tasks.
 */

// We keep the imports for type consistency if needed later
import { initializeApp, getApps, getApp } from 'firebase/app';

// Mock Configuration
const firebaseConfig = {
  apiKey: "DECOMMISSIONED",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Dummy App Instance
let appInstance;
try {
  appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  appInstance = { name: '[DEFAULT]', options: firebaseConfig };
}

// Mock Auth Service
export const auth: any = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Always trigger callback with null to simulate "not logged in via Firebase"
    // The AuthContext will handle checking for the 'meshwork_guest_mode' flag
    // and setting the DEV_USER accordingly.
    setTimeout(() => callback(null), 10);
    return () => {}; // No-op unsubscribe
  },
  signInWithPopup: () => Promise.reject("Firebase service is currently in maintenance. Please use Guest Mode."),
  signOut: () => Promise.resolve(),
};

// Mock Firestore Service
export const db: any = {
  // Methods like collection, doc, etc are mocked in flowService for local fallback
};

export const googleProvider = {};

export default appInstance;