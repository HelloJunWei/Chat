import { FIREBASE_INSTANCE } from '@/api/firebase'
import { getAuth, inMemoryPersistence, signOut, setPersistence, signInWithCustomToken } from 'firebase/auth'
import { useAuth } from '@vueuse/firebase'
import * as userApi from '@/api/user'
import type { UserInterface } from '@/types/user'

const AUTH = getAuth(FIREBASE_INSTANCE)

export const { isAuthenticated } = useAuth(AUTH)

export const login = async(token: string):Promise<UserInterface & { firebaseToken: string }> => {
  try {
    const userData = await userApi.login(token)
    // set token
    localStorage.setItem('token', token)
    return {
      userId: userData.userId,
      displayName: userData.displayName,
      photoUrl: userData.photoUrl,
      firebaseToken: userData.firebaseToken
    }
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getUserInfo = async (userIds: string[]):Promise<UserInterface[]> => {
  try {
    const userList = await userApi.getUserInfo(userIds)
    return userList.map((val) => {
      return {
        userId: val.userId,
        photoUrl: val.photoUrl,
        displayName: val.displayName
      }
    })

  } catch(e) {
    return Promise.reject(e)
  }

}

export const firebaseLogin = async (token: string):Promise<void> => {
  try {
    await setPersistence(AUTH, inMemoryPersistence)
    await signInWithCustomToken(AUTH, token)
  } catch (e) {
    console.error('firebase login error: ' + e )
    return Promise.reject(e)
  }
}

export const firebaseSignOut = (): void => {
  signOut(AUTH)
}
