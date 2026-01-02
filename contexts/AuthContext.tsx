import React, { createContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebaseService';
import { safeStorage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development
const DEV_USER = {
  uid: 'dev-guest-123',
  email: 'guest@meshwork.studio',
  displayName: 'Guest Architect',
  photoURL: null,
  emailVerified: true,
  isAnonymous: true,
} as unknown as User;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for dev mode flag
    const isGuest = safeStorage.getItem('meshwork_guest_mode') === 'true';
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Clear guest mode if we have a real user
        safeStorage.removeItem('meshwork_guest_mode');
      } else if (isGuest) {
        // Restore guest user if flag is present and no real user
        setUser(DEV_USER);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const loginAsGuest = () => {
    safeStorage.setItem('meshwork_guest_mode', 'true');
    setUser(DEV_USER);
  };

  const logout = async () => {
    try {
      safeStorage.removeItem('meshwork_guest_mode');
      await signOut(auth);
      // Force state clear in case signOut doesn't trigger listener (e.g. for guest user)
      setUser(null);
    } catch (error) {
      console.error("Error signing out", error);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};