import React, { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import styles from "../SearchFilters.module.scss";
import { Popover, MenuItem } from "@mui/material";
import { AppDispatch, RootState } from "../../../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setBeds } from "../../../../Redux/slice/searchSlice";
import { fetchRoomDetails } from "../../../../Redux/thunk/roomDataThunk";

interface SearchFiltersProps {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

const BedDropDown: React.FC<SearchFiltersProps> = ({ searchParams, setSearchParams }) => {
  const [beds, setParamBeds] = useState(searchParams.get("beds") || "1");
  const [bedsAnchorEl, setBedsAnchorEl] = useState<HTMLElement | null>(null);
  const [lastSetByDropdown, setLastSetByDropdown] = useState(false); // Track source of change
  const dispatch = useDispatch<AppDispatch>();

  const handleBedsOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setBedsAnchorEl(event.currentTarget);
  };

  const handleBedsClose = () => {
    setBedsAnchorEl(null);
  };

  const handleBedsChange = (value: string) => {
    setParamBeds(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("beds", value);
    setSearchParams(newParams);
    dispatch(setBeds(parseInt(value)));
    setLastSetByDropdown(true); // Mark change as dropdown-triggered
    handleBedsClose();
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

  // Detect manual query parameter changes
  useEffect(() => {
    const currentBeds = searchParams.get("beds") || "1";
    if (currentBeds !== beds) {
      setParamBeds(currentBeds);
      if (!lastSetByDropdown) {
        callRooms(); // Only call when changed manually
      }
      setLastSetByDropdown(false); // Reset flag
    }
  }, [searchParams]);

  return (
    <div className={`${styles.filters__item} ${styles["filters__item--beds"]}`}>
      <div onClick={handleBedsOpen}>
        <div className={styles.filters__select}>
          <div className={styles.filters__value}>
            <label className={styles.filters__label}>Beds</label>
            {beds}
          </div>
          <KeyboardArrowDownIcon className={styles.filters__icon} />
        </div>
      </div>

      <Popover
        open={Boolean(bedsAnchorEl)}
        anchorEl={bedsAnchorEl}
        onClose={handleBedsClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ 
          sx: { 
            width: { xs: "100%", sm: "auto" },
            minWidth: "8.125rem", // 130px
            maxHeight: "18.75rem", // 300px
            overflow: "auto" 
          } 
        }}
        disableScrollLock={true}
        container={document.body}
      >
        <div className={styles.filters__dropdown}>
          {[...Array(5).keys()].map((num) => (
            <MenuItem key={num + 1} onClick={() => handleBedsChange((num + 1).toString())}>
              {num + 1} Bed{num > 0 ? "s" : ""}
            </MenuItem>
          ))}
        </div>
      </Popover>
    </div>
  );
};

export default BedDropDown;
