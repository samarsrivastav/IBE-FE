import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { setStep } from "../../Redux/slice/stepSlice";

export const ItineraryButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.step.step);

  useEffect(() => {
    const storedStep = localStorage.getItem("step");
    if (storedStep) {
      dispatch(setStep(Number(storedStep))); // Sync Redux with localStorage
    }
  }, [dispatch]);

  const handleButtonClick = () => {
    const searchParam = localStorage.getItem("searchParams");
    if (currentStep === 2) {
      localStorage.setItem("step", "3");
      dispatch(setStep(3));
      navigate("/checkout");
    } else if (currentStep === 3) {
      localStorage.setItem("step", "2");
      dispatch(setStep(2));
      navigate(`/property?${searchParam}`);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
      {currentStep === 2 && (
        <Button variant="outlined" sx={{ borderColor: "#1A1A47", color: "#1A1A47" }} onClick={handleButtonClick}>
          CHECKOUT
        </Button>
      )}
      {currentStep === 3 && (
        <Button variant="outlined" sx={{ borderColor: "#1A1A47", color: "#1A1A47" }} onClick={handleButtonClick}>
          CONTINUE SHOPPING
        </Button>
      )}
    </Box>
  );
};
