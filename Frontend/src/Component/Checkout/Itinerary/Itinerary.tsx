import { Box, Typography, Button, Divider } from "@mui/material";

export const Itinerary = () => {
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
        Special Promoname, $132/night <sup>ⓘ</sup>
      </Typography>

      <Divider sx={{ marginY: "8px" }} />

      {[
        { label: "Subtotal", value: "$XXX.xx" },
        { label: "Taxes, Surcharges, Fees", value: "$XXX.xx" },
        { label: "VAT", value: "$XXX.xx" },
      ].map((item, index) => (
        <Box key={index} display="flex" justifyContent="space-between">
          <Typography variant="body2">
        {item.label} {item.label.includes("Fees") && <sup>ⓘ</sup>}
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
    </Box>
  );
};