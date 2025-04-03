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
}) => {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Validate the input value
  const validateInput = (inputValue: string): string | null => {
    // Check if the field is required but empty
    if (required && !inputValue.trim()) {
      return `Field cannot be empty`;
    }

    // Basic built-in validation based on input type
    if (inputValue.trim()) {
      switch (type) {
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(inputValue)) {
            return "Please enter a valid email address";
          }
          break;
        case "tel":
          const phoneRegex = /^\+?[0-9\s()-]{8,20}$/;
          if (!phoneRegex.test(inputValue)) {
            return "Please enter a valid phone number";
          }
          break;
        case "number":
          const numberRegex = /^-?\d*\.?\d*$/;
          if (!numberRegex.test(inputValue)) {
            return "Please enter a valid number";
          }
          break;
      }
    }

    // Run custom validation if provided
    if (customValidation) {
      return customValidation(inputValue);
    }

    return null;
  };

  // Handle input blur
  const handleBlur = () => {
    setTouched(true);
    if (validateOnBlur) {
      setError(validateInput(value));
    }
  };

  // Revalidate when value changes and the field has been touched
  useEffect(() => {
    if (touched) {
      setError(validateInput(value));
    }
  }, [value, touched]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width,
        height,
        marginBottom: "1rem",
      }}
    >
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
            "& fieldset": {
              borderColor: error ? "#d32f2f" : "#D3D3D3",
            },
            "&:hover fieldset": {
              borderColor: error ? "#d32f2f" : "#B0B0B0",
            },
            "&.Mui-focused fieldset": {
              borderColor: error ? "#d32f2f" : "#757575",
            },
          },
          input: {
            padding: "10px",
          },
          "& .MuiFormHelperText-root": {
            maxWidth:"21.625rem",
            minWidth: "8.4375rem", // 135px to rem
            height: "1.25rem", // 20px to rem
            fontFamily: "Lato",
            fontWeight: 400,
            fontSize: "0.875rem", // 14px to rem
            lineHeight: "140%",
            letterSpacing: "0rem",
            color: "#D0182B",
            margin:"0"
          },
        }}
      />
    </Box>
  );
};

export default CustomInput;
