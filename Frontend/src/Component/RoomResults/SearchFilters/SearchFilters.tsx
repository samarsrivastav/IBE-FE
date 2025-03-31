import React, { useEffect, useState } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import styles from "./SearchFilters.module.scss";
import { Popover, Snackbar, Alert } from "@mui/material";
import CalendarComponent from "../../SearchArea/HotelBookingCalender";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import RoomDropDown from "./RoomDropdown/RoomDropDown";
import BedDropDown from "./RoomDropdown/BedDropDown";
import { fetchProperties } from "../../../Redux/thunk/propertiesThunk";
import fetchPropertyConfig from "../../../Redux/thunk/propertyConfigThunk";
import { GuestDropDown } from "./GuestDropDown/GuestDropDown";
import { setBeds, setCheckIn, setCheckOut, setRooms } from "../../../Redux/slice/searchSlice";
import { fetchRoomDetails } from "../../../Redux/thunk/roomDataThunk";

interface SearchFiltersProps {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchParams,
  setSearchParams,
}) => {
  const dispatch = useDispatch();
  const searchState = useSelector((state: RootState) => state.search);
  let { checkIn, checkOut } = searchState;
  const newParams = new URLSearchParams(searchParams);
  if(!checkIn){
    checkIn = newParams.get("checkIn")??searchState.checkIn;
  }
  if(!checkOut){
    checkOut= newParams.get("checkOut")??searchState.checkOut;
  }
  const propertyId = searchState.PropertyId;
  const propertyConfig = useSelector((state: RootState) => state.propertyConfig);

  // Calendar dropdown state
  const [calendarAnchorEl, setCalendarAnchorEl] = useState<HTMLElement | null>(null);
  const handleCalendarOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setCalendarAnchorEl(event.currentTarget);
  };
  const handleCalendarClose = () => {
    setCalendarAnchorEl(null);
  };

  // Snackbar alert state
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleCloseAlert = () => setOpenAlert(false);

  // Ensure check-in is before check-out
  useEffect(() => {
    if (checkIn && checkOut && new Date(checkIn) > new Date(checkOut)) {
      setAlertMessage("Check-in date cannot be later than Check-out date.");
      setOpenAlert(true);
    }
  }, [checkIn, checkOut, dispatch]);

  // Sync calendar changes with query parameters
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (checkIn) newParams.set("checkIn", checkIn);
    if (checkOut) newParams.set("checkOut", checkOut);
    setSearchParams(newParams);
  }, [checkIn, checkOut, setSearchParams]);


  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      setAlertMessage("Please select both Check-in and Check-out dates.");
      setOpenAlert(true);
      return;
    }
  
    if (new Date(checkIn) > new Date(checkOut)) {
      setAlertMessage("Check-in date cannot be later than Check-out date.");
      setOpenAlert(true);
      return;
    }
  
    const newParams = new URLSearchParams(searchParams);
    newParams.set("checkIn", checkIn);
    newParams.set("checkOut", checkOut);
    setSearchParams(newParams);
  
    dispatch(setCheckIn(checkIn));
    dispatch(setCheckOut(checkOut));
  
    const rooms_count = newParams.get("rooms");
    const bed_count = newParams.get("beds");
  
    if (rooms_count) dispatch(setRooms(parseInt(rooms_count)));
    if (bed_count) dispatch(setBeds(parseInt(bed_count)));
  
    // Call API only when the search button is clicked
    if (propertyId) {
      dispatch(fetchPropertyConfig(propertyId));
    }
    //function to call rooms
    callRooms();
  };
  const searchSliceData=useSelector((state:RootState)=>state.search)
  const callRooms=()=>{
    dispatch(fetchRoomDetails({
      PropertyId: parseInt(searchParams.get("propertyId") || `${searchSliceData.PropertyId}`, 10),
      beds: parseInt(searchParams.get("beds") || `${searchSliceData.beds}`, 10),
      checkIn: searchParams.get("checkIn") || searchSliceData.checkIn,
      checkOut: searchParams.get("checkOut") || searchSliceData.checkOut,
      guests: searchSliceData.guests, // Ensure guests are correctly handled
      rooms: parseInt(searchParams.get("rooms") || `${searchSliceData.rooms}`, 10),
    }));
  }
  
  return (
    <div className={styles.filters}>
      <GuestDropDown />
      <RoomDropDown searchParams={searchParams} setSearchParams={setSearchParams} />
      <BedDropDown searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className={`${styles.filters__item} ${styles["filters__item--date"]}`} onClick={handleCalendarOpen}>
        <div className={styles.filters__select}>
          <div className={styles.filters__value}>
            <label className={styles.filters__label}>Check-in</label>
            {checkIn || "Select Date"}
          </div>
          <div className={styles.filters__value}>
            <label className={styles.filters__label}>Check-out</label>
            {checkOut || "Select Date"}
          </div>
          <CalendarTodayIcon className={styles.filters__calendar} />
        </div>
      </div>

      <Popover
        open={Boolean(calendarAnchorEl)}
        anchorEl={calendarAnchorEl}
        onClose={handleCalendarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ sx: { width: "896px", padding: 2 } }}
      >
        <CalendarComponent onClose={handleCalendarClose} />
      </Popover>

      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="error"
          sx={{
            width: "100%",
            backgroundColor: "#d32f2f",
            color: "white",
            "& .MuiAlert-icon": { color: "white" },
            "& .MuiAlert-action": { color: "white" },
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <button className={styles.filters__button} onClick={handleSearch}>SEARCH DATES</button>
    
    </div>
  );
};

export default SearchFilters;
