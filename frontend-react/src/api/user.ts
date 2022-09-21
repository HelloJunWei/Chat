import axios, {CanceledError} from 'axios'

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
  const controller = new AbortController()
  const timer = setTimeout(() => {
    controller.abort()
  }, 1500)
  try {
    const { data } = await userAxios.post<LoginInResponse>('/api/login', {
      token: token
    }, {
      signal: controller.signal
    })
    clearTimeout(timer)
    return Promise.resolve(data)
  } catch(e: unknown) {
    console.error(e)
    if (e instanceof CanceledError) {
      console.log('api cancel')
    }

    return Promise.reject(e)
  }
}
