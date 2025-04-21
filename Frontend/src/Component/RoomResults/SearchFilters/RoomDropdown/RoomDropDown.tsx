import React, { useEffect, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import styles from "../SearchFilters.module.scss";
import { Popover, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../Redux/store";
import { setRooms } from "../../../../Redux/slice/searchSlice";
import fetchPropertyConfig from "../../../../Redux/thunk/propertyConfigThunk";
import { fetchRoomDetails } from "../../../../Redux/thunk/roomDataThunk";

interface SearchFiltersProps {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

const RoomDropDown: React.FC<SearchFiltersProps> = ({ searchParams, setSearchParams }) => {
  const [rooms, setParamRooms] = useState(searchParams.get("rooms") || "1");
  const [roomsAnchorEl, setRoomsAnchorEl] = useState<HTMLElement | null>(null);
  const [lastSetByDropdown, setLastSetByDropdown] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const propertyConfig = useSelector((state: RootState) => state.propertyConfig);
  const propertyIdFromParams = searchParams.get("propertyId");
  const propertyId = propertyIdFromParams
    ? parseInt(propertyIdFromParams, 10)
    : useSelector((state: RootState) => state.search.PropertyId);

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchPropertyConfig(propertyId));
    }
  }, [dispatch, propertyId]);

  const handleRoomsOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setRoomsAnchorEl(event.currentTarget);
  };

  const handleRoomsClose = () => {
    setRoomsAnchorEl(null);
  };

  const handleRoomsChange = (value: string) => {
    setParamRooms(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("rooms", value);
    setSearchParams(newParams);
    dispatch(setRooms(parseInt(value)));
    setLastSetByDropdown(true);
    handleRoomsClose();
  };

  const searchSliceData=useSelector((state:RootState)=>state.search)
    const callRooms = () => {
      dispatch(
        fetchRoomDetails({
          PropertyId: searchSliceData.PropertyId || parseInt(searchParams.get("propertyId") || "0", 10),
          beds: searchSliceData.beds || parseInt(searchParams.get("beds") || "0", 10),
          checkIn: searchSliceData.checkIn || searchParams.get("checkIn") || "",
          checkOut: searchSliceData.checkOut || searchParams.get("checkOut") || "",
          guests: searchSliceData.guests,
          rooms: searchSliceData.rooms || parseInt(searchParams.get("rooms") || "0", 10),
        })
      );
    }
  

  useEffect(() => {
    const currentRooms = searchParams.get("rooms") || "1";
    if (currentRooms !== rooms) {
      setParamRooms(currentRooms);
      if (!lastSetByDropdown) {
        callRooms();
      }
      setLastSetByDropdown(false);
    }
  }, [searchParams]);

  return (
    <div className={`${styles.filters__item} ${styles["filters__item--rooms"]}`}>
      <div onClick={handleRoomsOpen}>
        <div className={styles.filters__select}>
          <div className={styles.filters__value}>
            <label className={styles.filters__label}>Rooms</label>
            {rooms}
          </div>
          <KeyboardArrowDownIcon className={styles.filters__icon} />
        </div>
      </div>

      <Popover
        open={Boolean(roomsAnchorEl)}
        anchorEl={roomsAnchorEl}
        onClose={handleRoomsClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        disableScrollLock={true}
        container={document.body}
      >
        <div className={styles.filters__dropdown}>
          {[...Array(propertyConfig.maxRooms).keys()].map((num) => (
            <MenuItem key={num + 1} onClick={() => handleRoomsChange((num + 1).toString())}>
              {num + 1} Room
            </MenuItem>
          ))}
        </div>
      </Popover>
    </div>
  );
};

export default RoomDropDown;
