import "./PaymentInfo.scss";
import { Heading } from "../../Heading/Heading";
import CustomInput from "../../Utils/CustomInput";
import CustomCheckboxes from "../../Utils/CustomCheckBoxes";
import OtpModal from "../../../Modal/OtpModal/OtpModal";
import { usePaymentInfo } from "../../../../Config/CustomHooks/persistedState/usePaymentInfo";
import { useState } from "react";
import { initiatePayment, verifyOtpAndCompletePayment } from "./config/paymentApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";

interface PaymentInfoProps {
  isOpen: boolean;
  setIsPaymentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBillingOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PaymentInfo = ({ isOpen, setIsPaymentOpen, setIsBillingOpen }: PaymentInfoProps) => {
  const { paymentInfo, setPaymentInfo, isValid } = usePaymentInfo();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [paymentRequestId, setPaymentRequestId] = useState<string | null>(null);
  const financialData = useSelector((state: RootState) => state.financial.data);
  const handleBack = () => {
    setIsBillingOpen(true);
    setIsPaymentOpen(false);
  };

  const handlePurchase = async () => {
    try {
      const response = await initiatePayment(paymentInfo);
      setPaymentRequestId(response.requestId);
      setIsOtpModalOpen(true);
    } catch (err) {
      alert("Failed to initiate payment. Please try again."+err);
    }
  };
  const navigate=useNavigate()
  const handleOtpConfirm = async (otp: string) => {
    if (!paymentRequestId) return;

    try {
      const response=await verifyOtpAndCompletePayment(paymentRequestId, otp);
      setIsOtpModalOpen(false);
      alert("Payment Successful!"+response.bookingId);
      navigate("/confirmation-page/"+response.bookingId)
    } catch (err) {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <>
      <div className={`payment__container ${isOpen ? "open" : "closed"}`}>
        <Heading title="3. Payment Info" />
        <div className="payment__inputs">
          <div className="input card__details">
            <CustomInput
              type="text"
              label="Card Name"
              value={paymentInfo.cardName}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
            />
            <div className="card__expiry">
              <CustomInput
                type="text"
                label="Exp MM"
                value={paymentInfo.expMonth}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, expMonth: e.target.value })}
                width="10.25rem"
              />
              <CustomInput
                type="text"
                label="Exp YY"
                value={paymentInfo.expYear}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, expYear: e.target.value })}
                width="10.25rem"
              />
            </div>
          </div>
          <div className="input">
            <CustomInput
              type="password"
              label="CVV Code"
              value={paymentInfo.cvv}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
              width="10.25rem"
            />
          </div>
        </div>
        <CustomCheckboxes />
        <div className="bottom__component">
          <div className="total__amount">
            <p>Total Due:</p>
            <p>${financialData?.dueNow}</p>
          </div>
          <div className="disable__button">
            <p className="edit-link" onClick={handleBack}>Edit Billing Info</p>
            <button disabled={!isValid} onClick={handlePurchase}>
              <p>Purchase</p>
            </button>
          </div>
        </div>
      </div>

      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onConfirm={handleOtpConfirm}
      />
    </>
  );
};
