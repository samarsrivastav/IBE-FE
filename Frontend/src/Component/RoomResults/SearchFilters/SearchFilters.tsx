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
import { setCheckIn, setCheckOut } from "../../../Redux/slice/searchSlice";

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
  const { checkIn, checkOut } = searchState;
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

      // Reset check-in date and keep check-out date
      dispatch(setCheckIn(""));
    }
  }, [checkIn, checkOut, dispatch]);

  // Sync calendar changes with query parameters
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (checkIn) newParams.set("checkIn", checkIn);
    if (checkOut) newParams.set("checkOut", checkOut);
    setSearchParams(newParams);
  }, [checkIn, checkOut, setSearchParams]);

  // Sync query parameters with Redux state
  useEffect(() => {
    const queryCheckIn = searchParams.get("checkIn");
    const queryCheckOut = searchParams.get("checkOut");

    if (queryCheckIn) dispatch(setCheckIn(queryCheckIn));
    if (queryCheckOut) dispatch(setCheckOut(queryCheckOut));
  }, [searchParams, dispatch]);

  useEffect(() => {
    dispatch(fetchProperties());
    if (propertyId) {
      dispatch(fetchPropertyConfig(propertyId));
    }
  }, [dispatch, propertyId]);

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
    </div>
  );
};

export default SearchFilters;
