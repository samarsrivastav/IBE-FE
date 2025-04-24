import { createSlice } from "@reduxjs/toolkit";
import { fetchRoomDetails } from "../thunk/roomDataThunk";

interface Amenity {
  icon: string;
  text: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  price: string;
  type: string;
}
export interface Package {
  id: string;
  title: string;
  description: string;
  price: string;
  type: string;
}
export interface PromotionRoom {
  roomTypeId: number;
  packages: Package[];
}

export interface Room {
  room_type_id: number;
  room_type_name: string;
  rating: number;
  reviews: number;
  location: string;
  area_in_square_feet: string;
  max_capacity: string;
  bedType: string;
  price: number;
  description: string;
  specialDeal?: { text: string };
  images: string[];
}

export interface RoomDetail extends Room {
  promotion?: Package[];
  amenities: string[];
}

interface RoomState {
  rooms: RoomDetail[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  rooms: [],
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoomDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload.map((room: any) => {
          let bedType = "";
          if (room.single_bed === 0 && room.double_bed > 0) {
            bedType = `${room.double_bed} King`;
          } else if (room.double_bed === 0 && room.single_bed > 0) {
            bedType = `${room.single_bed} Queen`;
          } else if (room.single_bed > 0 && room.double_bed > 0) {
            bedType = `${room.single_bed} Queen, ${room.double_bed} King`;
          }

          return {
            ...room,
            amenities: room.amenities || [],
            bedType,
          };
        });
      })
      .addCase(fetchRoomDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch room details";
      });
  },
});

export default roomSlice.reducer;
