import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useState, useEffect } from "react";
import {
  setPropertyId,
  setRooms,
  setNeedsAccessibleRoom,
  updateGuestCount,
  resetGuestCounts,
  setCheckIn,
  setCheckOut,
} from "../../Redux/slice/searchSlice";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Paper,
  IconButton,
  Popover,
  Alert,
  Snackbar,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CalendarComponent from "./HotelBookingCalender";
import AccessibleIcon from "@mui/icons-material/Accessible";
import "./SearchArea.scss";
import fetchPropertyConfig from "../../Redux/thunk/propertyConfigThunk";
import { fetchProperties } from "../../Redux/thunk/propertiesThunk";
import { useNavigate } from "react-router-dom";
import { Property } from "../../types";

interface PropertyData {
  property_id: number;
  property_name: string;
}

interface GuestCounts {
  adults: number;
  child: number;
  teen: number;
}

const SearchArea: React.FC = () => {
  
  const dispatch = useDispatch<AppDispatch>();
  const properties = useSelector((state: RootState) => state.properties.property.listProperties) as unknown as PropertyData[] || [];

  const searchState = useSelector((state: RootState) => state.search);
  const { checkIn, checkOut } = searchState;

  const selectedPropertyId = useSelector(
    (state: RootState) => state.search.PropertyId
  );

  const propertyId = useSelector((state: RootState) => state.search.PropertyId);

  // Restore search state from localStorage on mount
  useEffect(() => {
    const savedSearchState = localStorage.getItem('searchState');
    if (savedSearchState) {
      const parsedState = JSON.parse(savedSearchState);
      // Only restore if we have valid data
      if (parsedState.PropertyId) {
        dispatch(setPropertyId(parsedState.PropertyId));
      }
      if (parsedState.rooms) {
        dispatch(setRooms(parsedState.rooms));
      }
      if (parsedState.needsAccessibleRoom !== undefined) {
        dispatch(setNeedsAccessibleRoom(parsedState.needsAccessibleRoom));
      }
      if (parsedState.checkIn) {
        dispatch(setCheckIn(parsedState.checkIn));
      }
      if (parsedState.checkOut) {
        dispatch(setCheckOut(parsedState.checkOut));
      }
      if (parsedState.guests) {
        Object.entries(parsedState.guests).forEach(([type, value]) => {
          if (type === 'adults' || type === 'child' || type === 'teen') {
            dispatch(updateGuestCount({ type, value: value as number }));
          }
        });
      }
    }
  }, [dispatch]);

  // Save search state to localStorage whenever it changes
  useEffect(() => {
    if (searchState.PropertyId) { // Only save if we have a property selected
      localStorage.setItem('searchState', JSON.stringify(searchState));
    }
  }, [searchState]);

  useEffect(() => {
    dispatch(fetchProperties());
    if (propertyId) {
      dispatch(fetchPropertyConfig(propertyId));
    }
  }, [dispatch, propertyId]);

  const propertyConfig = useSelector(
    (state: RootState) => state.propertyConfig
  );

  // Calendar dropdown state
  const [calendarAnchorEl, setCalendarAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const handleCalendarOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setCalendarAnchorEl(event.currentTarget);
  };
  const handleCalendarClose = () => {
    setCalendarAnchorEl(null);
  };

  // Handle property selection
  const handleSelect = (propertyId: number) => {
    if (propertyId === 8 || propertyId === 20) {
      dispatch(setPropertyId(propertyId));
    }
  };

  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const navigate = useNavigate()
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPropertyId || selectedPropertyId === 0) {
      setAlertMessage("Please select a property");
      setOpenAlert(true);
      return;
    }

    if (!checkIn || !checkOut) {
      setAlertMessage("Please select check-in and check-out dates");
      setOpenAlert(true);
      return;
    }

    const guest = Object.entries(searchState.guests)
      .map(([key, value]) => {
        if (value > 0) return `${value} ${key}`;
        else return "";
      })
      .filter((value) => value !== "")
      .join(", ");

    const searchParams = new URLSearchParams();
    if (propertyId) {
      searchParams.set("propertyId", propertyId.toString());
    }
    searchParams.set("guests", guest);
    searchParams.set("rooms", searchState.rooms.toString());
    if (checkIn) searchParams.set("checkIn", checkIn);
    if (checkOut) searchParams.set("checkOut", checkOut);
    
    // Save search parameters to localStorage
    localStorage.setItem("searchParams", searchParams.toString());
    
    navigate("/property?" + searchParams.toString());
  };

  // Guest dropdown state
  const [guestAnchorEl, setGuestAnchorEl] = useState<HTMLElement | null>(null);
  const handleGuestMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setGuestAnchorEl(event.currentTarget);
  };
  const handleGuestMenuClose = () => {
    setGuestAnchorEl(null);
  };

  
  // Calculate total guests
  const totalGuests = Object.values(searchState.guests).reduce(
    (a: number, b: number) => a + b,
    0
  );

  // Define guest types based on propertyConfig
  type GuestType = "adults" | "child" | "teen";

  // Default guest types when no config is available
  let guestTypes: { type: GuestType; label: string; subLabel: string }[] = [
    {
      type: "adults",
      label: "Adults",
      subLabel: "Ages 18+",
    },
    {
      type: "teen",
      label: "Teens",
      subLabel: "Ages 13-17",
    },
    {
      type: "child",
      label: "Children",
      subLabel: "Ages 0-12",
    },
  ];

  // If propertyConfig and guestTypes exist, override with config values
  if (propertyConfig && propertyConfig.guestTypes) {
    guestTypes = [];

    // Always add adults
    if (propertyConfig.guestTypes.adult) {
      guestTypes.push({
        type: "adults",
        label: "Adults",
        subLabel: propertyConfig.guestTypes.adult,
      });
    } else {
      // Default value if not provided in config
      guestTypes.push({
        type: "adults",
        label: "Adults",
        subLabel: "Ages 18+",
      });
    }

    // Add teen option if it exists in propertyConfig
    if (propertyConfig.guestTypes.teen) {
      guestTypes.push({
        type: "teen",
        label: "Teens",
        subLabel: propertyConfig.guestTypes.teen,
      });
    }

    // Add child option if it exists in propertyConfig
    if (propertyConfig.guestTypes.child) {
      guestTypes.push({
        type: "child",
        label: "Children",
        subLabel: propertyConfig.guestTypes.child,
      });
    }
  }

  // Check if Add button should be disabled based on maxGuestPerRoom
  const isAddGuestDisabled = (type: string) => {
    if (!propertyConfig?.maxGuestPerRoom) return false;
    return totalGuests >= propertyConfig.maxGuestPerRoom;
  };

  const handleRoomChange = (newRoomCount: number) => {
    const guestPerRoom = propertyConfig?.maxGuestPerRoom || 4;
    const minRoomsRequired = Math.ceil(totalGuests / guestPerRoom);

    if (newRoomCount >= minRoomsRequired) {
      dispatch(setRooms(newRoomCount));
    }
  };

  // Ensure at least one adult is always selected
  const isRemoveAdultDisabled = searchState.guests.adults <= 1;

  // Generate room options based on maxRooms from property config
  const generateRoomOptions = () => {
    const maxRooms = propertyConfig?.maxRooms || 4; // Default to 4 if not set
    return Array.from({ length: maxRooms }, (_, index) => index + 1);
  };



  return (
    <Paper className="search-area__paper" elevation={1}>
      <Box
        component="form"
        onSubmit={handleSearch}
        className="search-area__form"
      >
        <FormControl fullWidth>
          <Typography>Property name*</Typography>
          <Select
            value={selectedPropertyId ?? 0}
            onChange={() => {}} // Empty onChange as we're handling selection via checkboxes
            displayEmpty
            sx={{ height: "48px" }}
            className="search-area__select"
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <span style={{ color: "grey", fontStyle: "italic" }}>
                    Search all property
                  </span>
                );
              }
              const property = properties?.find(
                (p: PropertyData) => p.property_id === selected
              );
              return property?.property_name ?? "Select a property";
            }}
          >
            {properties?.map((property: PropertyData) => (
              <MenuItem key={property.property_id} value={property.property_id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedPropertyId === property.property_id}
                      onChange={() => handleSelect(property.property_id)}
                    />
                  }
                  label={property.property_name}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography>Select dates</Typography>
          <Box
            className="search-area__date-selector"
            onClick={handleCalendarOpen}
          >
            <Typography className="search-area__date-selector-text">
              {checkIn && checkOut
                ? `${checkIn} → ${checkOut}`
                : "Check-in → Check-out"}
            </Typography>
            <IconButton>
              <CalendarTodayIcon className="search-area__date-selector-icon" />
            </IconButton>
          </Box>

          {/* Calendar dropdown */}
          <Popover
            open={Boolean(calendarAnchorEl)}
            anchorEl={calendarAnchorEl}
            onClose={handleCalendarClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            PaperProps={{
              sx: {
                width: "896px",
                padding: 2,
              },
            }}
          >
            <CalendarComponent onClose={handleCalendarClose} />
          </Popover>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Show guests section only if showGuest is true or not set yet */}
          {(propertyConfig?.showGuest === undefined ||
            propertyConfig?.showGuest) && (
            <FormControl sx={{ width: "100%" }}>
              <Typography>Guests</Typography>
              <Box
                onClick={handleGuestMenuClick}
                className="search-area__guest-selector"
              >
                <Typography>{totalGuests} Guests</Typography>
              </Box>
              <Popover
                open={Boolean(guestAnchorEl)}
                anchorEl={guestAnchorEl}
                onClose={handleGuestMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  className: "search-area__guest-popover",
                }}
              >
                {guestTypes.map(({ type, label, subLabel }) => (
                  <Box key={type} className="search-area__guest-item">
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: "700",
                          fontSize: "1rem",
                          lineHeight: "150%",
                          letterSpacing: "0px",
                        }}
                        variant="subtitle1"
                      >
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: "400",
                          fontSize: "0.875rem",
                          lineHeight: "140%",
                          letterSpacing: "0px",
                        }}
                        variant="caption"
                        color="text.secondary"
                      >
                        {subLabel}
                      </Typography>
                    </Box>
                    <Box className="search-area__guest-item-counter">
                      <IconButton
                        size="small"
                        onClick={() => {
                          dispatch(
                            updateGuestCount({
                              type,
                              value: searchState.guests[type] - 1,
                            })
                          );
                        }}
                        disabled={
                          type === "adults"
                            ? isRemoveAdultDisabled
                            : searchState.guests[type] === 0
                        }
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography className="search-area__guest-item-counter-value">
                        {searchState.guests[type] || 0}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => {
                          const newGuestCount =
                            (searchState.guests[type] || 0) + 1;
                          let newRooms = searchState.rooms;
                          const maxGuestsAllowed =
                            propertyConfig?.maxGuestPerRoom || 4;
                          const maxRoomsAllowed = propertyConfig?.maxRooms || 4;

                          if (totalGuests + 1 > newRooms * maxGuestsAllowed) {
                            newRooms = Math.min(newRooms + 1, maxRoomsAllowed);
                          }

                          dispatch(
                            updateGuestCount({ type, value: newGuestCount })
                          );
                          dispatch(setRooms(newRooms));
                        }}
                        disabled={isAddGuestDisabled(type)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
                {propertyConfig?.maxGuestPerRoom && (
                  <Typography
                    sx={{ p: 1, fontSize: "0.75rem" }}
                    color="text.secondary"
                  >
                    Maximum {propertyConfig.maxGuestPerRoom} guests per room
                  </Typography>
                )}
              </Popover>
            </FormControl>
          )}

          {/* Show rooms selection only if showRoomNumber is true or not set yet */}
          {(propertyConfig?.showRoomNumber === undefined ||
            propertyConfig?.showRoomNumber) && (
            <FormControl className="search-area__rooms-select">
              <Typography>Rooms</Typography>
              <Select
                value={searchState.rooms}
                onChange={(e) => handleRoomChange(Number(e.target.value))}
                className="search-area__select"
              >
                {generateRoomOptions().map((num) => (
                  <MenuItem
                    key={num}
                    value={num}
                    disabled={
                      num <
                      Math.ceil(
                        totalGuests / (propertyConfig?.maxGuestPerRoom || 4)
                      )
                    }
                  >
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Show wheelchair option only if wheelChairOption is true or not set yet */}
        {(propertyConfig?.wheelChairOption === undefined ||
          propertyConfig?.wheelChairOption) && (
          <FormControlLabel
            className="search-area__accessible-room-label"
            control={
              <Box display="flex" alignItems="center">
                <Checkbox
                  checked={searchState.needsAccessibleRoom}
                  onChange={(e) =>
                    dispatch(setNeedsAccessibleRoom(e.target.checked))
                  }
                />
                <AccessibleIcon style={{ marginLeft: "-0.7rem" }} />
              </Box>
            }
            label="I need an Accessible Room"
          />
        )}

        <Button
          type="submit"
          variant="contained"
          className="search-area__search-button"
        >
          SEARCH
        </Button>

        <Snackbar
          open={openAlert}
          autoHideDuration={3000}
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlert}
            severity="info"
            sx={{
              width: "100%",
              backgroundColor: "#0a157a",
              color: "white",
              "& .MuiAlert-icon": {
                color: "white",
              },
              "& .MuiAlert-action": {
                color: "white",
              },
            }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
};

export default SearchArea;
