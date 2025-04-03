import { Box, Typography, Button, Divider } from "@mui/material";
import CircusPromotionModal from "../../Modal/CircusPromotion/CircusPromotionModal";
import { useModal } from "../../../Config/CustomHooks/UseModal";
import RateBreakdownModal from "../../Modal/RateBreakdown/RateBreakdownModal";

export const Itinerary = () => {
  const promotionModal = useModal();
  const rateBreakdownModal = useModal();
  const promotionData = {
    title: 'Circus Saving Promotion',
    description: 'Experience the magic of savings with our special circus-themed promotion! Limited time offers that will make your wallet smile.',
    footer: {
      title: 'Total Savings',
      price: 2570.6,
    },
  };
  const rateBreakdownData = { 
    roomType: 'Room type',
    rateTitle: 'Nightly Rate (per room)',
    promotionTitle: 'Circus savings promotion',
    dailyRates: [
      { date: 'Wednesday, March 9, 2022', amount: 132 },
      { date: 'Wednesday, March 10, 2022', amount: 132 },
      { date: 'Wednesday, March 11, 2022', amount: 100 },
      { date: 'Wednesday, March 12, 2022', amount: 132 },
      { date: 'Wednesday, March 13, 2022', amount: 132 },
      { date: 'Wednesday, March 14, 2022', amount: 132 },
      { date: 'Wednesday, March 15, 2022', amount: 132 },
      { date: 'Wednesday, March 16, 2022', amount: 132 },
    ],
    roomTotal: 1024,
    taxes: [
      { name: 'Resort fee', amount: 132 },
      { name: 'Occupancy tax', amount: 132 },
    ],
    dueNow: 400,
    dueAtResort: 1288,
  };
  return (
    <Box sx={{ backgroundColor: "#EFF0F1", padding: "16px", borderRadius: "8px" }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" fontWeight="bold">
          Your Trip Itinerary
        </Typography>
        <Typography color="blue" sx={{ cursor: "pointer" }}>
          Remove
        </Typography>
      </Box>

      <Typography variant="subtitle1" fontWeight="bold" sx={{ marginTop: "8px" }}>
        Long Beautiful Resort Name
      </Typography>
      <Typography variant="body2" color="textSecondary">
        May 9 - May 16, 2022 | 1 adult 1 child
      </Typography>
      <Typography variant="body2">Executive Room</Typography>
      <Typography variant="body2">$132/night</Typography>
      <Typography variant="body2">1 room</Typography>
      <Typography variant="body2">
        Special Promoname, $132/night <sup onClick={()=>promotionModal.openModal("LARGE")}>ⓘ</sup>
      </Typography>

      <Divider sx={{ marginY: "8px" }} />

      {[
        { label: "Subtotal", value: "$XXX.xx" },
        { label: "Taxes, Surcharges, Fees", value: "$XXX.xx" },
        { label: "VAT", value: "$XXX.xx" },
      ].map((item, index) => (
        <Box key={index} display="flex" justifyContent="space-between">
          <Typography variant="body2">
        {item.label} {item.label.includes("Fees") && <sup onClick={()=>rateBreakdownModal.openModal("LARGE")}>ⓘ</sup>}
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
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
        <Button variant="outlined" sx={{ borderColor: "#1A1A47", color: "#1A1A47" }}>
          CONTINUE SHOPPING
        </Button>
      </Box>
      {/* Circus Promotion Modal */}
      <CircusPromotionModal
        isOpen={promotionModal.isOpen}
        onClose={promotionModal.closeModal}
        title={promotionData.title}
        description={promotionData.description}
        footer={promotionData.footer}
      />
      {/* Rate Breakdown Modal */}
      <RateBreakdownModal
        isOpen={rateBreakdownModal.isOpen}
        onClose={rateBreakdownModal.closeModal}
        {...rateBreakdownData}
      />
    </Box>
  );
};