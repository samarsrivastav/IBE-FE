import { Box,  Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/store";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { fetchExchangeRates } from "../../Redux/thunk/exchangeRateThunk";

export const CurrencyDisplay = () => {
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const { currency, exchangeRates, loading } = useSelector((state: RootState) => state.currency);

  const basePrice = 20; // Base price in USD

  useEffect(() => {
    dispatch(fetchExchangeRates()); // Fetch exchange rates on component mount
  }, [dispatch]);

  // Convert price using exchange rates
  const convertedPrice = exchangeRates[currency.toUpperCase()]
    ? (basePrice * exchangeRates[currency.toUpperCase()]).toFixed(2)
    : basePrice.toFixed(2);

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
