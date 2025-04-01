import React from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import './SortComponent.scss';
interface SortComponentProps {
  sortBy: string;
  setSortBy: (value: string) => void;
}

const SortComponent: React.FC<SortComponentProps> = ({ sortBy, setSortBy }) => {
  return (
    <FormControl variant="outlined" size="small">
      <InputLabel>Sort</InputLabel>
      <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort By">
        <MenuItem value="priceLow">Price</MenuItem>
        <MenuItem value="reviewsHigh">Reviews</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SortComponent;
