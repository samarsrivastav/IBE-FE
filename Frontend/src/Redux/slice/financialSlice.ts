// Redux/slice/financialSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FinancialData {
  roomTotal: number;
  taxes: number;
  dueNow: number;
  dueAtResort: number;
}

interface FinancialState {
  data: FinancialData | null;
}

const loadFromLocalStorage = (): FinancialData | null => {
  try {
    const saved = localStorage.getItem('financialData');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const initialState: FinancialState = {
  data: loadFromLocalStorage(),
};

const financialSlice = createSlice({
  name: 'financial',
  initialState,
  reducers: {
    setFinancialData: (state, action: PayloadAction<FinancialData>) => {
      state.data = action.payload;
      localStorage.setItem('financialData', JSON.stringify(action.payload));
    },
    clearFinancialData: (state) => {
      state.data = null;
      localStorage.removeItem('financialData');
    },
  },
});

export const { setFinancialData, clearFinancialData } = financialSlice.actions;
export default financialSlice.reducer;
