import { useEffect, useState } from "react";

export const usePaymentInfo = () => {
  const [paymentInfo, setPaymentInfo] = useState(() => {
    const stored = localStorage.getItem("paymentInfo");
    return stored ? JSON.parse(stored) : {
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: ""
    };
  });

  useEffect(() => {
    localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));
  }, [paymentInfo]);

  const isValid = Object.values(paymentInfo).every((val) => val.trim());

  return {
    paymentInfo,
    setPaymentInfo,
    isValid
  };
};
