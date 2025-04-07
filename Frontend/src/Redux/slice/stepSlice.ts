import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StepState {
  step: number;
}

const initialState: StepState = {
  step: 1, // Default step
};

const stepSlice = createSlice({
  name: "step",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
  },
});

export const { setStep } = stepSlice.actions;
export default stepSlice.reducer;
