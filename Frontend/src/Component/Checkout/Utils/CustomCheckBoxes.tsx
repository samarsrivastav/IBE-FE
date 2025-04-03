import React, { useState } from "react";
import { Checkbox, FormControlLabel, Box } from "@mui/material";

const CustomCheckboxes: React.FC = () => {
  const [specialOffers, setSpecialOffers] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <FormControlLabel
        sx={{ color: "#5D5D5D", width: "13.25rem", height: "1.4375rem",
            ".MuiCheckbox-root": {
                width: "0.9375rem",
                height: "0.9375rem",
                padding:"8px"
            },
            ".MuiFormControlLabel-label": {
                fontFamily: "Lato",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "140%",
                letterSpacing: "0px",

                marginLeft:"8px",
                minWidth: "11.9375rem",
                height: "1.4375rem"
            }
         }}
        control={
          <Checkbox
            checked={specialOffers}
            onChange={(e) => setSpecialOffers(e.target.checked)}
            sx={{ color: "#5D5D5D", width: "13.25rem", height: "1.4375rem"
             }}
          />
        }
        label="Send me special offers"
      />

      <FormControlLabel
        sx={{ color: "#5D5D5D", width: "20.3125rem", height: "1.4375rem",
            ".MuiCheckbox-root": {
                width: "0.9375rem",
                height: "0.9375rem",
                padding:"8px"
            },
            ".MuiFormControlLabel-label": {
                fontFamily: "Lato",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "140%",
                letterSpacing: "0px",
                marginLeft:"8px",
                width: "19rem",
                height: "1.4375rem"
            }
         }}
        control={
          <Checkbox
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            sx={{ color: "#5D5D5D", width: "20.3125rem", height: "1.4375rem" }}
          />
        }
        label="I agree to the Terms and Policies of travel"
      />
    </Box>
  );
};

export default CustomCheckboxes;
