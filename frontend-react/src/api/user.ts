import axios from 'axios'

const userAxios = axios.create({
  baseURL: 'http://localhost:4000',
  headers: { 'content-type': 'application/json' }
})


type LoginInResponse = {
  firebaseToken: string
  userId: string
  displayName: string
  photoUrl: string
}

export const login = async (token: string):Promise<LoginInResponse> => {
  try {
    const { data } = await userAxios.post<LoginInResponse>('/api/login', {
      token: token
    })
    return Promise.resolve(data)
  } catch(e) {
    return Promise.reject(e)
  }
}
