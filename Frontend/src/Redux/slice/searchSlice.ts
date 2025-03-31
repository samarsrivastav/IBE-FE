import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GuestCounts {
  adults: number;
  teen: number;
  child: number;
}

interface SearchState {
  PropertyId: number | null;
  checkIn: string | null;
  checkOut: string | null;
  guests: GuestCounts;
  rooms: number;
  beds:number;
  needsAccessibleRoom: boolean;
}

const initialState: SearchState = {
  PropertyId: null,
  checkIn: null,
  checkOut: null,
  guests: {
    teen: 0,
    adults: 1,
    child: 0
  },
  beds:1,
  rooms: 1,
  needsAccessibleRoom: false,
};

interface UpdateGuestCountPayload {
  type: keyof GuestCounts;
  value: number;
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setPropertyId: (state, action: PayloadAction<number>) => {
      state.PropertyId= action.payload;
    },
    setCheckIn: (state, action: PayloadAction<string>) => {
      state.checkIn = action.payload;
    },
    setCheckOut: (state, action: PayloadAction<string>) => {
      state.checkOut = action.payload;
    },
    updateGuestCount: (state, action: PayloadAction<UpdateGuestCountPayload>) => {
      const { type, value } = action.payload;
      state.guests[type] = value;
    },
    setBeds : (state, action: PayloadAction<number>) => {
      state.beds = action.payload;
    },
    setRooms: (state, action: PayloadAction<number>) => {
      state.rooms = action.payload;
    },
    setNeedsAccessibleRoom: (state, action: PayloadAction<boolean>) => {
      state.needsAccessibleRoom = action.payload;
    },
    resetGuestCounts: (state) => {
      state.guests = initialState.guests;
    },
    resetSearch: (state) => {
      return initialState;
    },
  },
});

export const {
  setPropertyId,
  setCheckIn,
  setCheckOut,
  updateGuestCount,
  setRooms,
  setBeds,
  setNeedsAccessibleRoom,
  resetGuestCounts,
  resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer; 