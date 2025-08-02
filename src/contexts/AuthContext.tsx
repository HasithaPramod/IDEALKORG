import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { isAdminEmail } from '@/config/admin';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Email/password login
  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Google Sign-In
  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    return signInWithPopup(auth, provider);
  }

  // Logout
  function logout() {
    return signOut(auth);
  }

  // Password reset
  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  // Update user profile
  function updateUserProfile(displayName: string) {
    if (currentUser) {
      return updateProfile(currentUser, { displayName });
    }
    throw new Error('No user logged in');
  }

  // Check if user is admin
  function checkAdminStatus(user: User | null) {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    // Check if user email is in admin list
    const isAdminUser = isAdminEmail(user.email || '');
    setIsAdmin(isAdminUser);

    // You can also check custom claims if you set them up in Firebase
    // user.getIdTokenResult().then((idTokenResult) => {
    //   setIsAdmin(idTokenResult.claims.admin === true);
    // });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      checkAdminStatus(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    loading,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 