import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GuestCounts {
  adults: number;
  teens: number;
  kids: number;
}

interface SearchState {
  propertyName: string[];
  checkIn: string;
  checkOut: string;
  guests: GuestCounts;
  rooms: number;
  needsAccessibleRoom: boolean;
}

const initialState: SearchState = {
  propertyName: [],
  checkIn: '',
  checkOut: '',
  guests: {
    adults: 2,
    teens: 1,
    kids: 0
  },
  rooms: 1,
  needsAccessibleRoom: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setPropertyName: (state, action: PayloadAction<string[]>) => {
      state.propertyName = action.payload;
    },
    setCheckIn: (state, action: PayloadAction<string>) => {
      state.checkIn = action.payload;
    },
    setCheckOut: (state, action: PayloadAction<string>) => {
      state.checkOut = action.payload;
    },
    updateGuestCount: (state, action: PayloadAction<{ type: keyof GuestCounts; value: number }>) => {
      const { type, value } = action.payload;
      state.guests[type] = Math.max(0, value); // Ensure count doesn't go below 0
    },
    setRooms: (state, action: PayloadAction<number>) => {
      state.rooms = action.payload;
    },
    setNeedsAccessibleRoom: (state, action: PayloadAction<boolean>) => {
      state.needsAccessibleRoom = action.payload;
    },
    resetSearch: (state) => {
      return initialState;
    },
  },
});

export const {
  setPropertyName,
  setCheckIn,
  setCheckOut,
  updateGuestCount,
  setRooms,
  setNeedsAccessibleRoom,
  resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer; 