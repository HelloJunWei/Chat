import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as userService from '../service/user'

export const login = createAsyncThunk(
  'user/login',
  async ({ token }: { token: string }) => {
    try {
      const data = await userService.login(token)
      return Promise.resolve(data)
    } catch (e) {
      return Promise.reject(4)
    }
  }
)

type UpdateTokenType = {
  token: string
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: '',
    firebaseToken: '',
    displayName: '',
    photoUrl: ''
  },
  reducers: {
    updateToken: {
      reducer(state, action: PayloadAction<UpdateTokenType>) {
        state.token = action.payload.token
      },
      prepare(token: string) {
        return {
          payload: {
            token
          }
        }
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, { payload }) => {
      console.log(payload)
      state.firebaseToken = payload.firebaseToken
      state.displayName = payload.displayName
      state.photoUrl = payload.photoUrl
    }),
    builder.addCase(login.rejected, (state, { payload }) => {
      console.log('error')
    })
  },
})

export const selector = (state: {
  user: {
    token: string,
    firebaseToken: string,
    displayName: string,
    photoUrl: string
  }
}) => state.user
export const { updateToken } = userSlice.actions
export default userSlice
