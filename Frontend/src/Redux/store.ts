import { combineReducers, configureStore } from '@reduxjs/toolkit'
import tempSliceReducer from './slice/tempSlice'
import currencySliceReducer from './slice/currencySlice'
import healthSliceReducer from './slice/healthSlice'
import propertySliceReducer from "./slice/propertiesSlice"
import searchReducer from './slice/searchSlice'
import propertyRateSliceReducer from './slice/propertyRateSlice'
import propertyConfigSliceReducer from './slice/propertyConfigSlice'
import tenantConfigSliceReducer from './slice/tenantConfigSlice'

export const store = configureStore({
  reducer: combineReducers({
    tempSlice: tempSliceReducer,
    currency: currencySliceReducer,
    health: healthSliceReducer,
    properties: propertySliceReducer,
    search: searchReducer,
    propertyRate: propertyRateSliceReducer,
    propertyConfig: propertyConfigSliceReducer,
    tenantConfig: tenantConfigSliceReducer,
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch