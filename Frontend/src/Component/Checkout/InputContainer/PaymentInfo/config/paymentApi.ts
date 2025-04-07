import axios from "axios";
const getConfirmationData=()=>{
  const selectedRoom = JSON.parse(localStorage.getItem("selectedRoom") || "{}");
  const selectedPackage = JSON.parse(localStorage.getItem("package") || "{}");
  const searchParams = localStorage.getItem("searchParams");
  const params = new URLSearchParams(searchParams ?? "");
  const guestCount = params.get("guests")

  const guestArray = guestCount?.split(",").map((guest) => {
    const [adults, children] = guest.split(" ");
    return {
      adults: parseInt(adults),
      children: parseInt(children),
    };
  });
  const totalGuestCount = guestArray?.reduce((acc, guest) => {
    return acc + guest.adults + guest.children;
  }, 0);
  const adultCount= guestArray?.reduce((acc, guest) => {
    return acc + guest.adults;
  }, 0);
  const childCount= guestArray?.reduce((acc, guest) => {
    return acc + guest.children;
  }, 0);
  const financialData = JSON.parse(localStorage.getItem("financialData") || "{}");
  console.log(financialData)
  const confirmationDetails = {
    imageUrl: selectedRoom.room?.images[0],
    roomName: selectedRoom.room?.title,
    startDate: params.get("checkIn"),
    endDate: params.get("checkOut"),
    roomTypeId: selectedRoom.room?.roomTypeId,
    guestCount: totalGuestCount,
    promotionTitle: selectedPackage.title,
    roomCount: params.get("rooms"),
    adultCount: adultCount,
    childCount: childCount,
    totalCost: selectedPackage.price,
    amountDueAtResort: selectedPackage.price,
    propertyId: params.get("propertyId"),
    nightlyRate: selectedPackage.price,
    subTotal: selectedPackage.price,
    taxes: financialData.taxes,
    vat: 0
  };
  return confirmationDetails;
}
export const initiatePayment = async () => {
  const billingInfo = localStorage.getItem("billingInfo");
  const travelersInfo = localStorage.getItem("travelerInfo");
  const paymentInfo = localStorage.getItem("paymentInfo");
  

  const data = {
    billingInfo: JSON.parse(billingInfo || "{}"),
    travelerInfo: JSON.parse(travelersInfo || "{}"),
    paymentInfo: JSON.parse(paymentInfo || "{}"),
    confirmationDetails: getConfirmationData(),
    currentIndex: 0,
    imageUrl: `${getConfirmationData().imageUrl}`,
    termsAndPolicies: true,
    specialOffers: false
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
    specialOffers: false
  };
  const response = await axios.post(import.meta.env.VITE_OTP_VERIFY_API_URL, { otpRequest, bookingRequestDto });
  console.log(response.data)
  const bookingId = response.data.message.split(":")[1].trim();
  return {
    bookingId:bookingId,
    messages:response.data.messages,
  };
};
