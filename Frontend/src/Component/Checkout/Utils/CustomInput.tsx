import React, { ChangeEvent, useState, useEffect } from "react";
import { TextField, Box, Typography } from "@mui/material";

interface CustomInputProps {
  label: string;
  type?: "text" | "email" | "tel" | "password" | "number";
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  width?: string;
  height?: string;
  validateOnBlur?: boolean;
  customValidation?: (value: string) => string | null;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  width = "21.1875rem",
  height = "4.3125rem",
  validateOnBlur = true,
  customValidation,
  setError,
}) => {
  const [touched, setTouched] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);

  const validateInput = (inputValue: string): string | null => {
    if (required && !inputValue.trim()) {
      return "Field cannot be empty";
    }
    if (inputValue.trim()) {
      switch (type) {
        case "email":
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue)
            ? null
            : "Please enter a valid email address";
        case "tel":
          const phoneDigitsOnly = inputValue.replace(/\D/g, "");
          if (phoneDigitsOnly.length > 10) return "Phone number cannot exceed 10 digits";
          return phoneDigitsOnly.length < 8 ? "Please enter a valid phone number" : null;
        case "number":
          return /^-?\d*\.?\d*$/.test(inputValue) ? null : "Please enter a valid number";
      }
    }
    return customValidation ? customValidation(inputValue) : null;
  };

  const handleBlur = () => {
    setTouched(true);
    if (validateOnBlur) {
      const errorMsg = validateInput(value);
      setLocalError(errorMsg);
      if (setError) {
        setError(errorMsg);
      }
    }
  };

  useEffect(() => {
    if (touched) {
      const errorMsg = validateInput(value);
      setLocalError(errorMsg);
      if(setError){
        setError(errorMsg);
      }
    }
  }, [value]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width, height, marginBottom: "1rem" }}>
      <Typography sx={{ fontSize: "12px", fontWeight: 400, color: "#757575", marginBottom: "4px" }}>
        {label}
      </Typography>
      <TextField
        type={type}
        variant="outlined"
        fullWidth
        value={value}
        onChange={onChange}
        required={required}
        error={!!error}
        helperText={error}
        placeholder={placeholder}
        onBlur={handleBlur}
        sx={{
          "& .MuiOutlinedInput-root": {
            height: error ? "auto" : "40px",
            borderRadius: "4px",
            "& fieldset": { borderColor: error ? "#d32f2f" : "#D3D3D3" },
            "&:hover fieldset": { borderColor: error ? "#d32f2f" : "#B0B0B0" },
            "&.Mui-focused fieldset": { borderColor: error ? "#d32f2f" : "#757575" },
          },
          input: { padding: "10px" },
          "& .MuiFormHelperText-root": {
            maxWidth: "21.625rem",
            minWidth: "8.4375rem",
            height: "1.25rem",
            fontFamily: "Lato",
            fontWeight: 400,
            fontSize: "0.875rem",
            lineHeight: "140%",
            letterSpacing: "0rem",
            color: "#D0182B",
            margin: "0",
          },
        }}
      />
    </Box>
  );
};

export default CustomInput;
