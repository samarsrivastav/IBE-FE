import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface tempState {
  value: string
}

const initialState: tempState = {
  value: "Hello_World",
}

export const tempSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    display: (state, action: PayloadAction<string>) => {
        state.value = action.payload
    },
  },
})


export const { display } = tempSlice.actions

export default tempSlice.reducer