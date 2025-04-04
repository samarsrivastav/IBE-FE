import { Box, Typography, Button, Divider } from "@mui/material";
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

  const location = useLocation();
  const removeItinery=()=>{
    const currentPage = location.pathname;
    console.log(currentPage)
    localStorage.removeItem("package")
    localStorage.removeItem("selectedRoom")
    localStorage.setItem("step","1")
    const searchParam=localStorage.getItem("searchParams")
    if(currentPage==="/property"){
      setSteps && setSteps();
    }
    navigate("/property?"+searchParam)
  }

  useEffect(() => {
    setData();
  }, []);

  const setData = () => {
    const promotionData = {
      title: selectedPackage.title,
      description: selectedPackage.description,
      footer: {
        title: "Total Savings",
        price: selectedPackage.price,
      },
    };
    setPromotionData(promotionData);

    const rateBreakdownData = {
      roomType: "Room type",
      rateTitle: "Nightly Rate (per room)",
      promotionTitle: "Circus savings promotion",
      dailyRates: [
        { date: "Wednesday, March 9, 2022", amount: 132 },
        { date: "Wednesday, March 10, 2022", amount: 132 },
        { date: "Wednesday, March 11, 2022", amount: 100 },
        { date: "Wednesday, March 12, 2022", amount: 132 },
        { date: "Wednesday, March 13, 2022", amount: 132 },
        { date: "Wednesday, March 14, 2022", amount: 132 },
        { date: "Wednesday, March 15, 2022", amount: 132 },
        { date: "Wednesday, March 16, 2022", amount: 132 },
      ],
      roomTotal: 1024,
      taxes: [
        { name: "Resort fee", amount: 132 },
        { name: "Occupancy tax", amount: 132 },
      ],
      dueNow: 400,
      dueAtResort: 1288,
    };
    setRateBreakdownData(rateBreakdownData);
  };

  return (
    <Box sx={{ backgroundColor: "#EFF0F1", padding: "16px", borderRadius: "8px" }}>
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
      <Typography variant="body2">Executive Room</Typography>
      <Typography variant="body2">$132/night</Typography>
      <Typography variant="body2">
        {rooms} room{rooms && parseInt(rooms) > 1 ? "s" : ""}
      </Typography>
      <Typography variant="body2">
        Special Promoname, ${packagePrice}/ night{" "}
        <sup onClick={() => promotionModal.openModal("LARGE")}>ⓘ</sup>
      </Typography>

      <Divider sx={{ marginY: "8px" }} />

      {[
        { label: "Subtotal", value: "$XXX.xx" },
        { label: "Taxes, Surcharges, Fees", value: "$XXX.xx" },
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
        { label: "Due Now", value: "$XXX.xx" },
        { label: "Due at Resort", value: "$XXX.xx" },
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