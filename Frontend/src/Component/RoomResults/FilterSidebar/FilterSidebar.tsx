import React, { useState } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import FilterGroup from "./FilterGroup/FilterGroup";
import styles from "./FilterSidebar.module.scss";

interface FilterSidebarProps {
  expandedFilters: { [key: string]: boolean };
  toggleFilter: (filter: string) => void;
  applyFilters: (filters: { bedTypes: string[]; locations: string[]; stars: number[] }) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ expandedFilters, toggleFilter, applyFilters }) => {
  const { rooms } = useSelector((state: RootState) => state.rooms);

  // Extract available bed types (Only King and Queen)
  const extractBedTypes = (bedTypeStr: string): string[] => {
    const types = [];
    if (bedTypeStr.toLowerCase().includes("king")) types.push("King");
    if (bedTypeStr.toLowerCase().includes("queen")) types.push("Queen");
    return types;
  };

  const availableBedTypes = [
    ...new Set(rooms.flatMap((room) => extractBedTypes(room.bedType))),
  ];
  const availableLocations = [...new Set(rooms.map((room) => room.location))];
  const availableStars = [1, 2, 3, 4, 5];
  type FilterCategory = "bedTypes" | "locations" | "stars";
  const [selectedFilters, setSelectedFilters] = useState<{
    bedTypes: string[];
    locations: string[];
    stars: number[];
  }>({
    bedTypes: [],
    locations: [],
    stars: [],
  });

  const handleCheckboxChange = (
    category: FilterCategory,
    value: string | number
  ) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[category] as (string | number)[];
      const updatedCategory = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

      const newFilters = { ...prev, [category]: updatedCategory };

      applyFilters({
        ...newFilters,
        bedTypes: newFilters.bedTypes, // Ensure correct filtering for bedTypes
      });

      return newFilters;
    });
  };

  return (
    <div className={styles.sidebar}>
      <h2 className={styles.sidebar__title}>Narrow your results</h2>

      <FilterGroup
        title="Bed Type"
        expanded={expandedFilters.bedType}
        onToggle={() => toggleFilter("bedType")}
      >
        {availableBedTypes.map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                checked={selectedFilters.bedTypes.includes(type)}
                onChange={() => handleCheckboxChange("bedTypes", type)}
              />
            }
            label={type}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        title="Location"
        expanded={expandedFilters.location}
        onToggle={() => toggleFilter("location")}
      >
        {availableLocations.map((location) => (
          <FormControlLabel
            key={location}
            control={
              <Checkbox
                checked={selectedFilters.locations.includes(location)}
                onChange={() => handleCheckboxChange("locations", location)}
              />
            }
            label={location}
          />
        ))}
      </FilterGroup>

      <FilterGroup
        title="Review Stars"
        expanded={expandedFilters.stars}
        onToggle={() => toggleFilter("stars")}
      >
        {availableStars.map((stars) => (
          <FormControlLabel
            key={stars}
            control={
              <Checkbox
                checked={selectedFilters.stars.includes(stars)}
                onChange={() => handleCheckboxChange("stars", stars)}
              />
            }
            label={`${stars} Stars`}
          />
        ))}
      </FilterGroup>
    </div>
  );
};

export default FilterSidebar;
