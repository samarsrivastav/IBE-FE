import React, { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, Box, Link } from "@mui/material";
import { useModal } from "../../../Config/CustomHooks/UseModal";
import TermsAndConditionsModal from "../../Modal/TermsAndCondition/TermsAndConditionsModal";

const CustomCheckboxes: React.FC = () => {
  const [specialOffers, setSpecialOffers] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const termsModal = useModal();
  const termsContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
  useEffect(() => {
    localStorage.setItem("setSelectedOffers", specialOffers.toString())
  }, [specialOffers])
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1,marginTop:"1rem" }}>
      <FormControlLabel
        sx={{
          color: "#5D5D5D",
          width: "13.25rem",
          height: "1.4375rem",
          marginLeft:"0",
          ".MuiCheckbox-root": { width: "0.9375rem", height: "0.9375rem", padding: "8px" },
          ".MuiFormControlLabel-label": { fontFamily: "Lato", fontWeight: 400, fontSize: "14px", lineHeight: "140%", marginLeft: "8px" },
        }}
        control={<Checkbox checked={specialOffers} onChange={(e) => setSpecialOffers(e.target.checked)} />}
        label="Send me special offers"
      />

      <FormControlLabel
        sx={{
          color: "#5D5D5D",
          width: "20.3125rem",
          height: "1.4375rem",
          marginLeft:"0",
          ".MuiCheckbox-root": { width: "0.9375rem", height: "0.9375rem", padding: "8px" },
          ".MuiFormControlLabel-label": { fontFamily: "Lato", fontWeight: 400, fontSize: "14px", lineHeight: "140%", marginLeft: "8px" },
        }}
        control={<Checkbox checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />}
        label={
          <span>
            I agree to the{" "}
            <Link component="button" onClick={()=>termsModal.openModal("LARGE")} sx={{ color: "blue", textDecoration: "none",font:"none" }}>
              Terms and Policies 
            </Link>
            {" "}of travel
          </span>
        }
      />
      <TermsAndConditionsModal
          isOpen={termsModal.isOpen}
          onClose={termsModal.closeModal}
          content={termsContent}
        />
    </Box>
  );
};

export default CustomCheckboxes;
