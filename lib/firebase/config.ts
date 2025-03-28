import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDPX0vFAlBbPWh_W-9z328r5mWMqOhSPMY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "stayhere-b1abe.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "stayhere-b1abe",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "stayhere-b1abe.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "252392861840",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:252392861840:web:4ed078b1d006e7dd902815",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }

