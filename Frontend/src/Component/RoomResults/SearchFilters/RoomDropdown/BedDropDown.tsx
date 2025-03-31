import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import styles from "../SearchFilters.module.scss";
import { Popover, MenuItem } from "@mui/material";
import { AppDispatch } from "../../../../Redux/store";
import { useDispatch } from "react-redux";
import { setBeds } from "../../../../Redux/slice/searchSlice";

interface SearchFiltersProps {
  searchParams: URLSearchParams;
  setSearchParams: (params: URLSearchParams) => void;
}

const BedDropDown: React.FC<SearchFiltersProps> = ({ searchParams, setSearchParams }) => {
  const [beds, setParamBeds] = useState(searchParams.get("beds") || "1");
  const [bedsAnchorEl, setBedsAnchorEl] = useState<HTMLElement | null>(null);

  const handleBedsOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setBedsAnchorEl(event.currentTarget);
  };

  const handleBedsClose = () => {
    setBedsAnchorEl(null);
  };
  const dispatch=useDispatch<AppDispatch>();
  const handleBedsChange = (value: string) => {
    setParamBeds(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("beds", value);
    setSearchParams(newParams);
    dispatch(setBeds(parseInt(value)))
    handleBedsClose();
  };

  return (
    <div className={`${styles.filters__item} ${styles["filters__item--beds"]}`}>
      <div  onClick={handleBedsOpen}>
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
