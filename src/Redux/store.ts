import { configureStore } from '@reduxjs/toolkit'
import tempSliceReducer from './slice/tempSlice'

export const store = configureStore({
  reducer: {
    'tempSlice': tempSliceReducer,
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch