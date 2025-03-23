import { createSlice } from "@reduxjs/toolkit";
import fetchPropertyConfig from "../thunk/propertyConfigThunk"

// {
//   "id": 3,
//   "propertyId": 15,
//   "showGuest": true,
//   "wheelChairOption": true,
//   "showRoomNumber": false,
//   "maxGuestPerRoom": 4,
//   "maxRoomsPerBooking": 15,
//   "guestTypes": {
//     "adult": "Ages 18+",
//     "child": "Ages 0-17"
//   }
// }


 interface PropertyConfig {
    id: number;
    propertyId: number;
    showGuest: boolean;
    wheelChairOption: boolean;
    showRoomNumber: boolean;
    maxGuestPerRoom: number;
    maxRooms: number;
    guestTypes: Record<string, any>;
}

const initialState: PropertyConfig = {
    id: 0,
    propertyId: 0,
    showGuest: true,
    wheelChairOption: true,
    showRoomNumber: true,
    maxGuestPerRoom: 4,
    maxRooms: 4,
    guestTypes : {
      "adult": 'Ages 18+',
      "child": 'Ages 13-17',
      "teen" : 'Ages 0-12',
    }
};


const propertyConfigSlice = createSlice({
    name: "propertyConfig",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPropertyConfig.fulfilled, (state, action) => {
          state.id = action.payload.id;
          state.propertyId = action.payload.propertyId;
          state.showGuest = action.payload.showGuest;
          state.wheelChairOption = action.payload.wheelChairOption;
          state.showRoomNumber = action.payload.showRoomNumber;
          state.maxGuestPerRoom = action.payload.maxGuestPerRoom;
          state.maxRooms = action.payload.maxRoomsPerBooking;
          state.guestTypes = action.payload.guestTypes;
        });
      },
  });

  

export default propertyConfigSlice.reducer  



