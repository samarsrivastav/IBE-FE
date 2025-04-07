import { combineReducers, configureStore } from '@reduxjs/toolkit'
import tempSliceReducer from './slice/tempSlice'
import currencySliceReducer from './slice/currencySlice'
import healthSliceReducer from './slice/healthSlice'
import propertySliceReducer from "./slice/propertiesSlice"
import searchReducer from './slice/searchSlice'
import propertyRateSliceReducer from './slice/propertyRateSlice'
import propertyConfigSliceReducer from './slice/propertyConfigSlice'
import tenantConfigSliceReducer from './slice/tenantConfigSlice'
import promotionSliceReducer from './slice/promotionSlice'
import roomReducer from "./slice/roomDataSlice"
import selectedRoomReducer from "./slice/selectRoomTypeSlice"
import promoCodeReducer from './slice/promoCodeSlice'
import stepReducer from "./slice/stepSlice"
import financialReducer from './slice/financialSlice'
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
    promotion: promotionSliceReducer,
    rooms: roomReducer,
    selectedRoom:selectedRoomReducer,
    promoCode: promoCodeReducer,
    step:stepReducer,
    financial: financialReducer,
  }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch