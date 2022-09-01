import admin, { app } from 'firebase-admin'
import path from 'path'
const serviceAccount = require(`/${path.join(__dirname, '../')}serviceKey.json`)

const connectPool: {
  [key: string]: app.App
} = {}
const FIREBASE_NAME = 'CHAT_INSTANCE'

export const initializeApp = () => {
  let instance: app.App
  if (connectPool[FIREBASE_NAME]) {
    instance = connectPool[FIREBASE_NAME]
  } else {
    instance = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
  })
    connectPool[FIREBASE_NAME] = instance
  }
}

export const getFirebaseApp = () => {
  if (!connectPool[FIREBASE_NAME]) initializeApp()
  return connectPool[FIREBASE_NAME]
}
