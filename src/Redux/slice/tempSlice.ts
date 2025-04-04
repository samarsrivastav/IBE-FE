import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface tempState {
  value: string
}

const initialState: tempState = {
  value: "Hello World",
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

// Action creators are generated for each case reducer function
export const { display } = tempSlice.actions

export default tempSlice.reducer