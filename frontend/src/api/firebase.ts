import { initializeFirebase } from '@/utils/firebase'
const FIREBASE_NAME = 'CHAT_MESSAGE'
const {
  INSTANCE: FIREBASE_INSTANCE
} =initializeFirebase({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  firebaseName: FIREBASE_NAME
})

export {
  FIREBASE_INSTANCE
}
