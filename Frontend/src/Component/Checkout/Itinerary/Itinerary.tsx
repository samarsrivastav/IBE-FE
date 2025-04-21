import { Box, Typography, Divider, useMediaQuery, useTheme } from "@mui/material";
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

interface PromotionData {
  title: string;
  description: string;
  footer: {
    title: string;
    price: number;
  };
}

interface DailyRate {
  date: string;
  amount: number;
}

interface TaxItem {
  name: string;
  amount: number;
}

interface ApiDataEntry {
  date: string;
  discountAmount: number;
}

interface RateBreakdownData {
  roomType: string;
  rateTitle: string;
  promotionTitle: string;
  dailyRates: DailyRate[];
  roomTotal: number;
  taxes: TaxItem[];
  dueNow: number;
  dueAtResort: number;
}

export const Itinerary = ({setSteps}:ItineraryProps) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  
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

  const [promotionData, setPromotionData] = useState<PromotionData | null>(null);
  const [rateBreakdownData, setRateBreakdownData] = useState<RateBreakdownData | null>(null);
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
  
    const dailyRates = apiData.map((entry: ApiDataEntry) => ({
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
    <Box sx={{ 
      backgroundColor: "#EFF0F1", 
      padding: { xs: "0.75rem", sm: "1rem", md: "1rem" }, 
      borderRadius: "8px",
      height: { 
        xs: "auto", 
        sm: "auto",
        md: currentStep === 2 ? "30.875rem" : "31.25rem" 
      },
      width: { 
        xs: "100%", 
        sm: "100%", 
        md: currentStep === 2 ? "20.625rem" : "25rem" 
      },
      minWidth: { xs: "100%", sm: "18.75rem", md: currentStep === 2 ? "20.625rem" : "25rem" },
      maxWidth: { xs: "100%", sm: "28.125rem", md: "none" },
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderWidth: "0px",
      borderStyle: "solid",
      borderColor: "#5D5D5D",
      marginBottom: { xs: "1rem", sm: "1rem", md: 0 },
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          sx={{ 
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.25rem" } 
          }}
        >
          Your Trip Itinerary
        </Typography>
        <Typography 
          color="blue" 
          sx={{ 
            cursor: "pointer",
            fontSize: { xs: "0.875rem", sm: "1rem", md: "1rem" } 
          }} 
          onClick={removeItinery}
        >
          Remove
        </Typography>
      </Box>

      <Typography 
        variant="subtitle1" 
        fontWeight="bold" 
        sx={{ 
          marginTop: { xs: "0.5rem", sm: "0.625rem", md: "0.625rem" },
          fontSize: { xs: "0.875rem", sm: "1rem", md: "1rem" }
        }}
      >
        {ItineraryRoomTitle}
      </Typography>
      <Typography 
        variant="body2" 
        color="textSecondary"
        sx={{ 
          fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" }
        }}
      >
        {formatDateRange(checkIn,checkOut)} | {guests}
      </Typography>
      <Box display="flex" justifyContent="space-between" marginTop="0.125rem">
        <Typography 
          variant="body2"
          sx={{ 
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" }
          }}
        >
          Executive Room 
        </Typography>
        <Typography 
          variant="body2"
          sx={{ 
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" }
          }}
        >
          {rooms} room{rooms && parseInt(rooms) > 1 ? "s" : ""}
        </Typography>
      </Box>
      <Typography variant="body2"></Typography>

      <Typography 
        variant="body2"
        sx={{ 
          fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" },
          marginTop: "0.125rem"
        }}
      >
        Special Promoname, ${packagePrice}/ night{" "}
        <sup 
          onClick={() => promotionModal.openModal("LARGE")}
          style={{ cursor: "pointer" }}
        >ⓘ</sup>
      </Typography>

      <Divider sx={{ marginY: { xs: "0.5rem", sm: "0.5rem", md: "0.5rem" } }} />

      {[
        { label: "Subtotal", value: `$${financialData?.roomTotal}` },
        { label: "Taxes, Surcharges, Fees", value: `$${financialData?.taxes.toFixed(2)}` },
      ].map((item, index) => (
        <Box key={index} display="flex" justifyContent="space-between" marginY="0.125rem">
          <Typography 
            variant="body2"
            sx={{ 
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" }
            }}
          >
            {item.label}{" "}
            {item.label.includes("Fees") && (
              <sup 
                onClick={() => rateBreakdownModal.openModal("LARGE")}
                style={{ cursor: "pointer" }}
              >ⓘ</sup>
            )}
          </Typography>
          <Typography 
            variant="body2"
            sx={{ 
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" }
            }}
          >
            {item.value}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ marginY: { xs: "0.5rem", sm: "0.5rem", md: "0.5rem" } }} />

      {[
        { label: "Due Now", value: `$${financialData?.dueNow}` },
        { label: "Due at Resort", value: `$${financialData?.dueAtResort}` },
      ].map((item, index) => (
        <Box key={index} display="flex" justifyContent="space-between" marginY="0.125rem">
          <Typography 
            variant="body2"
            sx={{ 
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" },
              fontWeight: index === 0 ? "bold" : "normal"
            }}
          >
            {item.label}
          </Typography>
          <Typography 
            variant="body2"
            sx={{ 
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" },
              fontWeight: index === 0 ? "bold" : "normal"
            }}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
      <Box sx={{ marginTop: { xs: "1rem", sm: "1rem", md: "1rem" } }}>
        <ItineraryButton />
      </Box>
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