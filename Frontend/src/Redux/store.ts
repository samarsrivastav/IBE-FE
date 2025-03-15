import { combineReducers, configureStore } from '@reduxjs/toolkit'
import tempSliceReducer from './slice/tempSlice'
import currencySliceReducer from './slice/currencySlice'
import healthSliceReducer from './slice/healthSlice'
import propertySliceReducer from "./slice/propertiesSlice"

export const store = configureStore({
  reducer: combineReducers({
    tempSlice: tempSliceReducer,
    currency: currencySliceReducer,
    health: healthSliceReducer,
    properties: propertySliceReducer
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch