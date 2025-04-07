import { useState } from "react";

export const useOtpVerification = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");

  const sendOtp = async () => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setServerOtp(generatedOtp);
    setIsModalOpen(true);

    // Replace this with actual API call to send OTP
    await fetch("/api/send-otp", {
      method: "POST",
      body: JSON.stringify({ otp: generatedOtp }),
    });
  };

  const verifyOtp = async () => {
    if (otp === serverOtp) {
      await fetch("/api/process-payment", { method: "POST" });
      alert("Payment successful!");
      setIsModalOpen(false);
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    otp,
    setOtp,
    sendOtp,
    verifyOtp,
  };
};
