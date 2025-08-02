import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { validateEnvironment, getFirebaseConfig } from '@/config/security';

// Validate environment variables
const envValidation = validateEnvironment();
if (!envValidation.valid) {
  console.error('Environment validation failed:', envValidation.errors);
  if (import.meta.env.PROD) {
    throw new Error('Environment configuration is incomplete. Please check your environment variables.');
  }
}

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBRtVdPmY2WphBI9dvWXsQqNqlWApsPo4A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "idealk-bc413.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "idealk-bc413",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "idealk-bc413.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "267781681663",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:267781681663:web:84eb5adc01f39906c1f7ca",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-89VNK6P5FL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (only in production)
let analytics;
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  analytics = getAnalytics(app);
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

export default app; 