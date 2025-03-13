import { configureStore } from '@reduxjs/toolkit'
import tempSliceReducer from './slice/tempSlice'
import currencySliceReducer from './slice/currencySlice'

export const store = configureStore({
  reducer: {
    'tempSlice': tempSliceReducer,
    "currency": currencySliceReducer
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch