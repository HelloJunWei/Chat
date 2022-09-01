import axios, { AxiosRequestConfig } from 'axios'

const userAxios = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: { 'content-type': 'application/json' }
})
userAxios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        authorization: token
      }
    }
    return config
  },
  err => Promise.reject(err)
)

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
type UserInfoResponse = {
  userId: string
  displayName: string
  photoUrl: string
}

export const getUserInfo  = async (userIds: string[]): Promise<UserInfoResponse[]> => {
  try {
    const { data } = await userAxios.get<UserInfoResponse[]>('/api/users', {
      params: {
        userIds
      }
    })
    return Promise.resolve(data)
  } catch(e) {
    return Promise.reject(e)
  }
}

type SendMessageResponse = {
  messageId: string
}

export const sendMessage = async(roomId: string, message: string): Promise<SendMessageResponse> => {
  try {
    const { data } = await userAxios.post<SendMessageResponse>('/api/sendMessage', {
      roomId: roomId,
      message: message
    })
    return Promise.resolve(data)
  } catch(e) {
    return Promise.reject(e)
  }
}

export const updateUserReadCount = async(roomId: string):Promise<void> => {
  try {
    await userAxios.post<SendMessageResponse>('/api/readRoomMessage', {
      roomId: roomId,
    })
    return Promise.resolve()
  } catch(e) {
    return Promise.reject(e)
  }


}
