import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styles from "../SearchFilters.module.scss";
import {
  Box,
  FormControl,
  Typography,
  IconButton,
  Popover,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { AppDispatch, RootState } from "../../../../Redux/store";
import {
  setRooms,
  updateGuestCount,
} from "../../../../Redux/slice/searchSlice";
import fetchPropertyConfig from "../../../../Redux/thunk/propertyConfigThunk";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const GuestDropDown = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const searchState = useSelector((state: RootState) => state.search);
  const propertyConfig = useSelector(
    (state: RootState) => state.propertyConfig
  );
  const [searchParams, setSearchParams]=useSearchParams();
  const propertyId = searchParams.get("propertyId")??searchState.PropertyId;
  
  const location = useLocation();
  const [guestAnchorEl, setGuestAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchPropertyConfig(propertyId));
    }
  }, [dispatch, propertyId]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const guestParam = params.get("guests");

    if (guestParam) {
      const guests: Record<string, number> = {};
      guestParam.split(",").forEach((entry) => {
        let [count, type] = entry.trim().split(" ");
        type = type.toLowerCase();
        if (type === "adult") type = "adults"; // Normalize to "adults"
        guests[type] = parseInt(count, 10) || 0;
      });

      Object.entries(guests).forEach(([type, value]) => {
        dispatch(updateGuestCount({ type, value }));
      });
    }
  }, [dispatch, location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.delete("guests");

    const guestParam = Object.entries(searchState.guests)
      .filter(([_, count]) => count > 0) // Exclude zero-count guests
      .map(([type, count]) => `${count} ${type}`)
      .join(",");

    if (guestParam) {
      params.set("guests", guestParam);
    }

    navigate(`?${params.toString()}`, { replace: true });
  }, [searchState.guests, navigate]);

  const handleGuestMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setGuestAnchorEl(event.currentTarget);
  };

  const handleGuestMenuClose = () => {
    setGuestAnchorEl(null);
  };

  const totalGuests = Object.values(searchState.guests || {}).reduce((a, b) =>
    isNaN(b) ? a : a + b
  );

  type GuestType = "adults" | "child" | "teen";

  const guestTypes: { type: GuestType; label: string; subLabel: string }[] =
    propertyConfig?.guestTypes
      ? Object.entries(propertyConfig.guestTypes).map(([type, subLabel]) => {
          const normalizedType = type === "adult" ? "adults" : type;
          return {
            type: normalizedType as GuestType,
            label:
              normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1),
            subLabel: subLabel as string,
          };
        })
      : [
          { type: "adults", label: "Adults", subLabel: "Ages 18+" },
          { type: "teen", label: "Teens", subLabel: "Ages 13-17" },
          { type: "child", label: "Children", subLabel: "Ages 0-12" },
        ];

  const isAddGuestDisabled = () =>
    propertyConfig?.maxGuestPerRoom
      ? totalGuests >= propertyConfig.maxGuestPerRoom
      : false;

  return (
    <FormControl
      className={`${styles.filters__item} ${styles["filters__item--guests"]}`}
      sx={{ width: "100%" }}
    >
      <div  onClick={handleGuestMenuClick}>
        <div className={styles.filters__select}>
          <div className={styles.filters__value}>
            <label className={styles.filters__label}>Guests</label>
            {Object.entries(searchState.guests)
            .filter(([_, count]) => count > 0) // Exclude guests with count 0
            .map(([type, count]) => `${count} ${type}`)
            .join(", ") || "Select Guests"}{" "}
          </div>
          <KeyboardArrowDownIcon className={styles.filters__icon} />
        </div>
      </div>
     

      <Popover
        open={Boolean(guestAnchorEl)}
        anchorEl={guestAnchorEl}
        onClose={handleGuestMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ className: "search-area__guest-popover" }}
        disableScrollLock={true}
        container={document.body}
      >
        {guestTypes.map(({ type, label, subLabel }) => (
          <Box key={type} className="search-area__guest-item">
            <Box>
              <Typography
                sx={{ fontWeight: "700", fontSize: "1rem" }}
                variant="subtitle1"
              >
                {label}
              </Typography>
              <Typography
                sx={{ fontWeight: "400", fontSize: "0.875rem" }}
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
                  const newGuestCount = Math.max(
                    (searchState.guests[type] || 0) - 1,
                    0
                  );
                  dispatch(
                    updateGuestCount({
                      type: type === "adult" ? "adults" : type,
                      value: newGuestCount,
                    })
                  );
                }}
                disabled={
                  type === "adults"
                    ? searchState.guests.adults <= 1
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
                  const newGuestCount = (searchState.guests[type] || 0) + 1;
                  let newRooms = searchState.rooms;
                  const maxGuestsAllowed = propertyConfig?.maxGuestPerRoom || 4;
                  const maxRoomsAllowed = propertyConfig?.maxRooms || 4;

                  if (totalGuests + 1 > newRooms * maxGuestsAllowed) {
                    newRooms = Math.min(newRooms + 1, maxRoomsAllowed);
                  }

                  dispatch(
                    updateGuestCount({
                      type: type === "adult" ? "adults" : type,
                      value: newGuestCount,
                    })
                  );
                  dispatch(setRooms(newRooms));
                }}
                disabled={isAddGuestDisabled()}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
        {propertyConfig?.maxGuestPerRoom && (
          <Typography sx={{ p: 1, fontSize: "0.75rem" }} color="text.secondary">
            Maximum {propertyConfig.maxGuestPerRoom} guests per room
          </Typography>
        )}
      </Popover>
    </FormControl>
  );
};
