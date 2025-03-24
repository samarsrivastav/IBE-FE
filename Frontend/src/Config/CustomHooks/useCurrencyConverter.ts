import { useEffect } from "react";
import { fetchExchangeRates } from "../../Redux/thunk/exchangeRateThunk";
import { AppDispatch, RootState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";

interface PriceData {
  date: string;
  price: number;
}

export const useCurrencyConverter = (pricesData: PriceData[]) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currency, exchangeRates, loading } = useSelector((state: RootState) => state.currency);

  useEffect(() => {
    dispatch(fetchExchangeRates());
  }, [dispatch]);

  const convertedPrices = pricesData.map(({ date, price }) => ({
    date,
    price: exchangeRates[currency.toUpperCase()]
      ? parseFloat((price * exchangeRates[currency.toUpperCase()]).toFixed(2))
      : parseFloat(price.toFixed(2)),
  }));

  return { convertedPrices, loading, currency };
};
