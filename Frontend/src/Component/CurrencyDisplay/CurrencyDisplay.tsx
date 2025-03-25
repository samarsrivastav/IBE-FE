import { Box,  Typography } from "@mui/material";
import { useIntl } from "react-intl";
import { useCurrencyConverter } from "../../Config/CustomHooks/useCurrencyConverter";

export const CurrencyDisplay = () => {
  const intl = useIntl();
  const {currency,convertedPrice,loading}=useCurrencyConverter();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" fontWeight="bold" sx={{ color: "#10072C" }}>
        {intl.formatMessage({ id: "currency" })}: {currency.toUpperCase()}
      </Typography>

      <Typography variant="body2" fontWeight="bold" sx={{ color: "#10072C" }}>
        {loading ? "Loading..." : `${convertedPrice} ${currency.toUpperCase()}`}
      </Typography>
    </Box>
  );
};
