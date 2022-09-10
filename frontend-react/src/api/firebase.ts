import { initializeFirebase } from '../utils/firebase'
const FIREBASE_NAME = 'CHAT_MESSAGE'
const {
  INSTANCE: FIREBASE_INSTANCE
} =initializeFirebase({
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  firebaseName: FIREBASE_NAME
})

export {
  FIREBASE_INSTANCE
}
