import * as userApi from '../api/user'
import type { UserInterface } from '../types/user'

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
