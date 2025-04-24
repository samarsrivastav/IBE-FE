import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { useEffect } from "react";
import { fetchExchangeRates } from "../../Redux/thunk/exchangeRateThunk";

export const useCurrencyConverter = (price:number) => {
    const dispatch = useDispatch<AppDispatch>();
      const { currency, exchangeRates, loading } = useSelector((state: RootState) => state.currency);
    
      useEffect(() => {
        dispatch(fetchExchangeRates());
      }, [dispatch]);
      const convertedPrice = {
      //convert the price to the selected currency
        price: exchangeRates[currency.toUpperCase()]
          ? parseFloat((price * exchangeRates[currency.toUpperCase()]).toFixed(2))
          : parseFloat(price.toFixed(2)),
    };
    

    return { convertedPrice, loading, currency };
  };