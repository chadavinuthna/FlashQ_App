import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase Setup Instructions for Expo:
 * 1. Create a Firebase Project in the Firebase Console (https://console.firebase.google.com/).
 * 2. Enable Authentication (Email/Password), Cloud Firestore, and Firebase Storage.
 * 3. Register a Web App in your Firebase project settings to obtain your API credentials.
 * 4. Copy `.env.example` to `.env` in the root directory and fill in your values.
 * 5. Expo SDK automatically exposes environment variables prefixed with `EXPO_PUBLIC_` to the app bundle.
 */

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let app = null;
let auth = null;
let db = null;
let storage = null;

// Check if valid Firebase configuration exists
const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

try {
  if (isFirebaseConfigured) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('[Firebase] Successfully initialized Firebase SDK with environment configuration.');
  } else {
    console.warn(
      '[Firebase] Missing EXPO_PUBLIC_FIREBASE_* environment variables. Running in local fallback mode. Copy .env.example to .env to connect your live Firebase project.'
    );
  }
} catch (error) {
  console.warn('[Firebase] Initialization warning:', error.message);
}

export { app, auth, db, storage, isFirebaseConfigured };

