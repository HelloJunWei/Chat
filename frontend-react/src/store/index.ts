import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import user from './user'


const store = configureStore({
  reducer: {
    user: user.reducer
  },
})

export default store
export type RootState = ReturnType<typeof store.getState>
export const useUserSelector: TypedUseSelectorHook<RootState> = useSelector

export type AppDispatch = typeof store.dispatch

export const useUserDispatch: () => AppDispatch = useDispatch