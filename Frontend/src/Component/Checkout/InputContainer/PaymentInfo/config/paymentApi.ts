import axios from "axios";
import { messages } from "../../../../../Constant/language/i18n";

export const initiatePayment = async (paymentInfo:any) => {
  const response = await axios.post("/data/dummyConfirmation.json", paymentInfo);
  return {
    requestId:"123456",
    message:"payment completed"
  }; 
};

export const verifyOtpAndCompletePayment = async (requestId: string, otp: string) => {
  // const response = await axios.post("/api/verify-otp", { requestId, otp });
  return {
    bookingId:"e17a098b-5d22-4dce-94a4-0fdb67e03cb6",
    messages:"Otp Verified"
  };
};
