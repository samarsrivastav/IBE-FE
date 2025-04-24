

import axios from "axios";
import authService from "../../../../../Services/authServices";
const getConfirmationData=()=>{
  const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom") || "{}");
  const selectedPackage = JSON.parse(localStorage.getItem("package") || "{}");
  const searchParams = localStorage.getItem("searchParams");
  const params = new URLSearchParams(searchParams ?? "");
  const guestCount = params.get("guests")
  console.log(guestCount)

  const guestArray = guestCount?.split(",")
  console.log(guestArray)
  //['1 adults', '1 child']
  const adultsCount = (guestArray ?? [])[0]?.split(" ")[0]
  const childCount = (guestArray ?? [])[1]?.split(" ")[0]

  console.log(adultsCount,childCount)
  const totalGuestCount = [Number(adultsCount), Number(childCount)]
  

  const financialData = JSON.parse(localStorage.getItem("financialData") || "{}");

  const confirmationDetails = {
    imageUrl: selectedRoom.room?.images[0],
    roomName: selectedRoom.room?.title,
    startDate: params.get("checkIn"),
    endDate: params.get("checkOut"),
    roomTypeId: selectedRoom.room?.roomTypeId,
    guestCount: totalGuestCount,
    promotionTitle: selectedPackage.title,
    roomCount: Number(params.get("rooms")),
    adultCount: Number(adultsCount),
    childCount: Number(childCount),
    totalCost: financialData.roomTotal+financialData.taxes,
    amountDueAtResort: selectedPackage.price,
    propertyId: params.get("propertyId"),
    nightlyRate: selectedPackage.price,
    subTotal: financialData.roomTotal,
    taxes: financialData.taxes,
    vat: 0
  };
  return confirmationDetails;
}
export const initiatePayment = async () => {
  const billingInfo = localStorage.getItem("billingInfo");
  const travelersInfo = localStorage.getItem("travelerInfo");
  const paymentInfo = localStorage.getItem("paymentInfo");
  
  console.log(localStorage.getItem("setSelectedOffers"))
  const data = {
    billingInfo: JSON.parse(billingInfo || "{}"),
    travelerInfo: JSON.parse(travelersInfo || "{}"),
    paymentInfo: JSON.parse(paymentInfo || "{}"),
    confirmationDetails: getConfirmationData(),
    currentIndex: 0,
    imageUrl: `${getConfirmationData().imageUrl}`,
    termsAndPolicies: true,
    specialOffers: localStorage.getItem("setSelectedOffers") === "true"
  };
  const response = await axios.post(import.meta.env.VITE_PAYMENT_INITIATE_API_URL, data);
  return {
    message:response.data.message,
  }; 
};

export const verifyOtpAndCompletePayment = async (otp: string) => {
  const billingInfo = localStorage.getItem("billingInfo");
  const travelerInfo = localStorage.getItem("travelerInfo");
  const paymentInfo = localStorage.getItem("paymentInfo");
  const otpRequest={
    email: JSON.parse(billingInfo ?? "{}").email,
    otp: otp,
  }
  const bookingRequestDto = {
    billingInfo: JSON.parse(billingInfo || "{}"),
    travelerInfo: JSON.parse(travelerInfo || "{}"),
    paymentInfo: JSON.parse(paymentInfo || "{}"),
    confirmationDetails: getConfirmationData(),
    currentIndex: 0,
    imageUrl: `${getConfirmationData().imageUrl}`,
    termsAndPolicies: true,
    specialOffers: localStorage.getItem("setSelectedOffers") === "true"
  };
  const response = await axios.post(import.meta.env.VITE_OTP_VERIFY_API_URL, { otpRequest, bookingRequestDto });
  console.log(response.data)
  const bookingId = response.data.message.split(":")[1].trim();
  return {
    bookingId:bookingId,
    messages:response.data.messages,
  };
};

export const createAuthenticatedBooking = async () => {
  const token = await authService.getValidToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  console.log(token);
  const data = {
    billingInfo: JSON.parse(localStorage.getItem("billingInfo") || "{}"),
    travelerInfo: JSON.parse(localStorage.getItem("travelerInfo") || "{}"),
    paymentInfo: JSON.parse(localStorage.getItem("paymentInfo") || "{}"),
    confirmationDetails: getConfirmationData(),
    currentIndex: 0,
    imageUrl: `${getConfirmationData().imageUrl}`,
    termsAndPolicies: true,
    specialOffers: localStorage.getItem("setSelectedOffers") === "true"
  };
  
  const response = await axios.post(import.meta.env.VITE_AUTHENTICATED_BOOKING_API_URL, data, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  console.log(response.data);

  const bookingId = response.data.message.split(":")[1].trim();
  return {
    bookingId: bookingId,
    messages: response.data.messages
  };
};
