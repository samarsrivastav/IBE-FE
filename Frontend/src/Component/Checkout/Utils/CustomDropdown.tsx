import React, { useState, useEffect } from "react";
import { MenuItem, Select, Box, Typography } from "@mui/material";

interface Option {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  width?: string;
  height?: string;
  placeholder?: string;
  validateOnBlur?: boolean;
  customValidation?: (value: string) => string | null;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  required = false,
  width = "21.1875rem",
  height = "4.3125rem",
  placeholder = "Choose",
  validateOnBlur = true,
  customValidation,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const validateSelection = (selectedValue: string): string | null => {
    if (required && !selectedValue) return "Field cannot be empty";
    if (customValidation) return customValidation(selectedValue);
    return null;
  };

  const handleBlur = () => {
    setTouched(true);
    if (validateOnBlur) setError(validateSelection(value));
  };

  useEffect(() => {
    if (touched) setError(validateSelection(value));
  }, [value, touched]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width, height }}>
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: 400,
          color: "#757575",
          marginBottom: "4px",
        }}
      >
        {label}
      </Typography>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={handleBlur}
        displayEmpty
        variant="outlined"
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            height: "40px",
            borderRadius: "4px",
            borderColor: error ? "#d32f2f" : "#D3D3D3",
            "&:hover fieldset": { borderColor: error ? "#d32f2f" : "#B0B0B0" },
            "&.Mui-focused fieldset": { borderColor: error ? "#d32f2f" : "#757575" },
          },
          "& .MuiSelect-select": { padding: "10px" },
        }}
      >
        <MenuItem value="" disabled>{placeholder}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && (
        <Typography sx={{ color: "#D0182B", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CustomDropdown;
