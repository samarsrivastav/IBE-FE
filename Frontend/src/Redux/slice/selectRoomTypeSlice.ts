import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoomModalProps } from '../../Component/RoomResults/RoomModal/RoomModal';
import { RootState } from '../store';

interface SelectedRoomState {
  selectedRoom: RoomModalProps | null;
}

// Load the selected room from localStorage (if available)
const savedRoom = localStorage.getItem("selectedRoom");
const initialState: SelectedRoomState = {
  selectedRoom: savedRoom ? JSON.parse(savedRoom) : null,
};

const selectedRoomSlice = createSlice({
  name: "selectedRoom",
  initialState,
  reducers: {
    setSelectedRoom: (state, action: PayloadAction<RoomModalProps>) => {
      state.selectedRoom = action.payload;
      localStorage.setItem("selectedRoom", JSON.stringify(action.payload));
    },
    clearSelectedRoom: (state) => {
      state.selectedRoom = null;
      localStorage.removeItem("selectedRoom");
    },
  },
});

export const { setSelectedRoom, clearSelectedRoom } = selectedRoomSlice.actions;
export const selectSelectedRoom = (state: RootState) => state.selectedRoom.selectedRoom;
export default selectedRoomSlice.reducer;
