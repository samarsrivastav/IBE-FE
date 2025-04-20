import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpModal from "../../Modal/OtpModal/OtpModal";
import axios from "axios";
import LoaderModal from "../../Util/Loader";

interface CancelRoomButtonProps {
  email: string;
  confirmationId: string | undefined;
}

const CancelRoomButton = ({ email, confirmationId }: CancelRoomButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInitiateCancel = async () => {
    setIsLoading(true); 
    try {
      await axios.post(import.meta.env.VITE_CANCEL_INITIATE_API_URL, {
        email,
        confirmationId,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to initiate cancellation", err);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleConfirmOtp = async (otp: string) => {
    try {
      const response = await axios.post(import.meta.env.VITE_CANCEL_VERIFY_API_URL, {
        email,
        confirmationId,
        otp,
      });

      if (response.data?.verified) {
        const userKey = 'oidc.user:https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_IGHZ9OObg:3f2gia86f7p8shj66jfok9p3co';
        const userValue = localStorage.getItem(userKey);
        localStorage.clear();
        if (userValue) {
          localStorage.setItem(userKey, userValue);
        }
        setIsModalOpen(false);
        navigate("/");
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      console.error("OTP verification failed", err);
      alert("Something went wrong. Try again.");
    }finally{
        setIsLoading(false);
    }

  };

  return (
    <>
      <button onClick={handleInitiateCancel}>Cancel Room</button>
      <OtpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmOtp}
      />
       <LoaderModal isOpen={isLoading} text="Processing request..." />
    </>
  );
};

export default CancelRoomButton;
