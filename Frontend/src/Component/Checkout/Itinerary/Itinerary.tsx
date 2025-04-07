import { Box, Typography, Divider } from "@mui/material";
import CircusPromotionModal from "../../Modal/CircusPromotion/CircusPromotionModal";
import { useModal } from "../../../Config/CustomHooks/UseModal";
import RateBreakdownModal from "../../Modal/RateBreakdown/RateBreakdownModal";
import { useItinerary } from "../../../Config/CustomHooks/useItinary";
import { useEffect, useState } from "react";
import { ItineraryButton } from "../../Util/ItineryButton";
import { formatDateRange } from "../../../utils/dateFormatUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { calculateDueAtResort, calculateDueNow, calculateRoomTotal, calculateTaxes, fetchRateData, formatDate } from "./utils";
import { setFinancialData } from "../../../Redux/slice/financialSlice";
import { setStep } from "../../../Redux/slice/stepSlice";

interface ItineraryProps{
  setSteps?:()=>void
}
export const Itinerary = ({setSteps}:ItineraryProps) => {
  const dispatch = useDispatch();
  
  
  const promotionModal = useModal();
  const rateBreakdownModal = useModal();
  const {
    guests,
    rooms,
    checkIn,
    checkOut,
    packagePrice,
    selectedPackage,
    ItineraryRoomTitle,
  } = useItinerary();

  const [promotionData, setPromotionData] = useState(null);
  const [rateBreakdownData, setRateBreakdownData] = useState(null);
  const navigate=useNavigate();
  const currentStep=useSelector((state: RootState) => state.step.step);
  const location = useLocation();
  const removeItinery = async () => {
    const currentPage = location.pathname;
    // First dispatch the step change
    dispatch(setStep(1));
    
    // Then clear storage and set new step
    localStorage.removeItem("package");
    localStorage.removeItem("selectedRoom");
    localStorage.setItem("step", "1");
    
    const searchParam = localStorage.getItem("searchParams");
    if (currentPage === "/property") {
      setSteps && setSteps();
    }
    
    // Force a re-render of the steps indicator by adding a small delay before navigation
    setTimeout(() => {
      navigate("/property?" + searchParam);
    }, 0);
  };

  useEffect(() => {
    setData();
  }, []);
  const financialData = useSelector((state: RootState) => state.financial.data);
  
  const setData = async () => {
    const apiData = await fetchRateData(selectedPackage.title,checkIn,checkOut);
    if (!apiData.length) return;
  
    const promotionData = {
      title: selectedPackage.title,
      description: selectedPackage.description,
      footer: {
        title: "Total Savings",
        price: selectedPackage.price,
      },
    };
    setPromotionData(promotionData);
  
    const dailyRates = apiData.map((entry: any) => ({
      date: formatDate(entry.date),
      amount: entry.discountAmount,
    }));
  
    const roomTotal = calculateRoomTotal(dailyRates);
    const taxes = calculateTaxes(roomTotal);
    const dueNow = calculateDueNow(roomTotal, taxes, selectedPackage.title);
    const dueAtResort = calculateDueAtResort(roomTotal, dueNow);
  
    const rateBreakdownData = {
      roomType: "Room type",
      rateTitle: "Nightly Rate (per room)",
      promotionTitle: selectedPackage.title,
      dailyRates,
      roomTotal,
      taxes,
      dueNow,
      dueAtResort,
    };
    setRateBreakdownData(rateBreakdownData);
  
    const totalTaxes = taxes.reduce((sum, tax) => sum + tax.amount, 0);
    dispatch(
      setFinancialData({
        roomTotal,
        taxes: totalTaxes,
        dueNow,
        dueAtResort,
      })
    );
  };
  
  
  return (
    <Box sx={{ backgroundColor: "#EFF0F1", padding: "16px", borderRadius: "8px",
      height: currentStep === 2 ? "30.875rem" : "31.25rem",
      width: currentStep === 2 ? "20.625rem" : "25rem",
      display:"flex",
      flexDirection:"column",
      justifyContent:"space-between",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#5D5D5D",
     }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" fontWeight="bold">
          Your Trip Itinerary
        </Typography>
        <Typography color="blue" sx={{ cursor: "pointer" }} onClick={removeItinery}>
          Remove
        </Typography>
      </Box>

      <Typography variant="subtitle1" fontWeight="bold" sx={{ marginTop: "8px" }}>
        {ItineraryRoomTitle}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {formatDateRange(checkIn,checkOut)} | {guests}
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">
          Executive Room 
        </Typography>
        <Typography variant="body2">{rooms} room{rooms && parseInt(rooms) > 1 ? "s" : ""}</Typography>
      </Box>
      <Typography variant="body2"></Typography>

      <Typography variant="body2">
        Special Promoname, ${packagePrice}/ night{" "}
        <sup onClick={() => promotionModal.openModal("LARGE")}>ⓘ</sup>
      </Typography>

      <Divider sx={{ marginY: "8px" }} />

      {[
        { label: "Subtotal", value: `$${financialData?.roomTotal}` },
        { label: "Taxes, Surcharges, Fees", value: `$${financialData?.taxes.toFixed(2)}` },
      ].map((item, index) => (
        <Box key={index} display="flex" justifyContent="space-between">
          <Typography variant="body2">
            {item.label}{" "}
            {item.label.includes("Fees") && (
              <sup onClick={() => rateBreakdownModal.openModal("LARGE")}>ⓘ</sup>
            )}
          </Typography>
          <Typography variant="body2">{item.value}</Typography>
        </Box>
      ))}

      <Divider sx={{ marginY: "8px" }} />

      {[
        { label: "Due Now", value: `$${financialData?.dueNow}` },
        { label: "Due at Resort", value: `$${financialData?.dueAtResort}` },
      ].map((item, index) => (
        <Box key={index} display="flex" justifyContent="space-between">
          <Typography variant="body2">{item.label}</Typography>
          <Typography variant="body2">{item.value}</Typography>
        </Box>
      ))}
      <ItineraryButton />
      {/* Circus Promotion Modal */}
      {promotionData && (
        <CircusPromotionModal
          isOpen={promotionModal.isOpen}
          onClose={promotionModal.closeModal}
          title={promotionData.title}
          description={promotionData.description}
          footer={promotionData.footer}
        />
      )}
      {/* Rate Breakdown Modal */}
      {rateBreakdownData && (
        <RateBreakdownModal
          isOpen={rateBreakdownModal.isOpen}
          onClose={rateBreakdownModal.closeModal}
          {...rateBreakdownData}
        />
      )}
    </Box>
  );
};