import { createSlice } from '@reduxjs/toolkit';
import { fetchPromotionRate } from '../thunk/promotionThunk';



 interface PromotionRate {
    promotionId: number;
    tenantId: number;
    startDate: [number, number, number];
    endDate: [number, number, number];
    discount: number;
}

const initialState: PromotionRate[] = [];

const promotionSlice = createSlice({
    name: 'promotion',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPromotionRate.fulfilled, (state, action) => {
            return action.payload;
        })
    }
})

export default promotionSlice.reducer;
