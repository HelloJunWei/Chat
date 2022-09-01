import { initializeApp } from 'firebase/app'
import type { FirebaseApp } from 'firebase/app'

export type FirebaseConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  firebaseName: string
}

// 要有個connect pool 這樣連進來的 store 都會是同一個
const connectPool: {
  [key: string]: FirebaseApp
} = {}

export const initializeFirebase = (config: FirebaseConfig) => {
  const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  }
  
  let instance: FirebaseApp
  if (connectPool[config.firebaseName]) {
    instance = connectPool[config.firebaseName]
  } else {
    instance = initializeApp(firebaseConfig, config.firebaseName)
    connectPool[config.firebaseName] = instance
  }

  return {
    INSTANCE: instance
  }
}
