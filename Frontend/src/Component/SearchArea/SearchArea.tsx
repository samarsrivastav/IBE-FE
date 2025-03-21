import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useState } from "react";
import {
  setPropertyName,
  setRooms,
  setNeedsAccessibleRoom,
  updateGuestCount,
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
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CalendarComponent from "./Calender";
import AccessibleIcon from "@mui/icons-material/Accessible";
import "./SearchArea.scss";


const SearchArea: React.FC = () => {



 


  const dispatch = useDispatch<AppDispatch>();
  const searchState = useSelector((state: RootState) => state.search);
  const { checkIn, checkOut } = searchState;

  const selectedProperties = useSelector(
    (state: RootState) => state.search.propertyName
  );

  // Calendar dropdown state
  const [calendarAnchorEl, setCalendarAnchorEl] = useState<HTMLElement | null>(null);
  const handleCalendarOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setCalendarAnchorEl(event.currentTarget);
  };
  const handleCalendarClose = () => {
    setCalendarAnchorEl(null);
  };

  const handleSelect = (property: string) => {
    let updatedSelection = selectedProperties.includes(property)
      ? selectedProperties.filter((item: string) => item !== property)
      : [...selectedProperties, property];
    dispatch(setPropertyName(updatedSelection));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search with:", searchState);
  };

  // Guest dropdown state
  const [guestAnchorEl, setGuestAnchorEl] = useState<HTMLElement | null>(null);
  const handleGuestMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setGuestAnchorEl(event.currentTarget);
  };
  const handleGuestMenuClose = () => {
    setGuestAnchorEl(null);
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
            multiple
            value={selectedProperties}
            onChange={() => {}}
            displayEmpty
            className="search-area__select"
            renderValue={(selected) => {
              if (!selected || selected.length === 0) {
                return (
                  <span style={{ color: "grey", fontStyle: "italic" }}>
                    Search all properties
                  </span>
                );
              }
              return selected.join(", ");
            }}
          >
            {["Property 1", "Property 2", "Property 3"].map((property) => (
              <MenuItem key={property} value={property}>
                <Checkbox
                  checked={selectedProperties.includes(property)}
                  onChange={() => handleSelect(property)}
                />
                {property}
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
          <FormControl sx={{ width: "100%" }}>
            <Typography>Guests</Typography>
            <Box
              onClick={handleGuestMenuClick}
              className="search-area__guest-selector"
            >
              <Typography>
                {Object.values(searchState.guests).reduce((a, b) => a + b, 0)}{" "}
                Guests
              </Typography>
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
              {[
                {
                  type: "adults" as const,
                  label: "Adults",
                  subLabel: "Ages 18+",
                },
                {
                  type: "teens" as const,
                  label: "Teens",
                  subLabel: "Ages 13-17",
                },
                { type: "kids" as const, label: "Kids", subLabel: "Ages 0-12" },
              ].map(({ type, label, subLabel }) => (
                <Box key={type} className="search-area__guest-item">
                  <Box>
                    <Typography sx ={{fontWeight:"700",fontSize:"1rem",lineHeight:"150%",letterSpacing:"0px"}} variant="subtitle1">{label}</Typography>
                    <Typography sx ={{fontWeight:"400",fontSize:"0.875rem",lineHeight:"140%",letterSpacing:"0px"}}variant="caption" color="text.secondary">
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
                      disabled={searchState.guests[type] === 0}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography className="search-area__guest-item-counter-value">
                      {searchState.guests[type]}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        dispatch(
                          updateGuestCount({
                            type,
                            value: searchState.guests[type] + 1,
                          })
                        );
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Popover>
          </FormControl>

          <FormControl className="search-area__rooms-select">
            <Typography>Rooms</Typography>
            <Select
              value={searchState.rooms}
              onChange={(e) => dispatch(setRooms(Number(e.target.value)))}
              className="search-area__select"
            >
              {[1, 2, 3, 4].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <FormControlLabel className="search-area__accessible-room-label"
          control={
            <Box display="flex" alignItems="center">
              <Checkbox
                checked={searchState.needsAccessibleRoom}
                onChange={(e) =>
                  dispatch(setNeedsAccessibleRoom(e.target.checked))
                }
              />
              <AccessibleIcon style={{ marginLeft : "-0.7rem" }} />
            </Box>
          }
          label="I need an Accessible Room"
        />

        <Button
          type="submit"
          variant="contained"
          className="search-area__search-button"
        >
          SEARCH
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchArea;  