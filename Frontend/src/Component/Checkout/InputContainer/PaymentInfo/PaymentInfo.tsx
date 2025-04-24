import "./PaymentInfo.scss";
import { Heading } from "../../Heading/Heading";
import CustomInput from "../../Utils/CustomInput";
import CustomCheckboxes from "../../Utils/CustomCheckBoxes";
import OtpModal from "../../../Modal/OtpModal/OtpModal";
import { usePaymentInfo } from "../../../../Config/CustomHooks/persistedState/usePaymentInfo";
import { useState } from "react";
import { initiatePayment, verifyOtpAndCompletePayment, createAuthenticatedBooking } from "./config/paymentApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import LoaderModal from "../../../Util/Loader";
import { Alert, Snackbar } from "@mui/material";
import authService from "../../../../Services/authServices";

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface PaymentInfoProps {
  isOpen: boolean;
  setIsPaymentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBillingOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface OtpVerificationResponse {
  verified?: boolean;
  message?: string;
  bookingId?: string;
}

export const PaymentInfo = ({ isOpen, setIsPaymentOpen, setIsBillingOpen }: PaymentInfoProps) => {
  const { paymentInfo, setPaymentInfo, isValid } = usePaymentInfo();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [paymentRequestId, setPaymentRequestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const MAX_OTP_ATTEMPTS = 3;
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const financialData = useSelector((state: RootState) => state.financial.data);

  const handleBack = () => {
    setIsBillingOpen(true);
    setIsPaymentOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handlePurchase = async () => {
    setIsLoading(true);
    try {

      authService.isAuthenticated();
      const token = await authService.getValidToken();
      
      
      if (token) {
        // Authenticated flow
        const response = await createAuthenticatedBooking();
        setSnackbar({
          open: true,
          message: `Payment Successful! Booking ID: ${response.bookingId}`,
          severity: 'success'
        });
        
        // Navigate to confirmation page
        navigate(`/confirmation-page/${response.bookingId}`);
      } else {
        console.log('User is not authenticated');
        // Non-authenticated flow
        const response = await initiatePayment();
        setPaymentRequestId(response.message);
        setSnackbar({
          open: true,
          message: 'Payment initiated successfully. Please check your email for OTP.',
          severity: 'success'
        });
        setIsOtpModalOpen(true);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to process payment. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();
  const handleOtpConfirm = async (otp: string) => {
    if (!paymentRequestId) return;

    try {
      const response: OtpVerificationResponse = await verifyOtpAndCompletePayment(otp);
      
      // First check if the response indicates verification failure
      if (response && response.verified === false) {
        setSnackbar({
          open: true,
          message: response.message || 'Verification failed',
          severity: 'error'
        });
        return;
      }
      
       // Then check for valid booking ID
       if (response && response.bookingId && typeof response.bookingId === 'string' && UUID_REGEX.test(response.bookingId)) {
        setIsOtpModalOpen(false);
        setSnackbar({
          open: true,
          message: `Payment Successful! Booking ID: ${response.bookingId}`,
          severity: 'success'
        });
        setTimeout(() => {
          navigate("/confirmation-page/" + response.bookingId);
        }, 2000);
      } else {
      console.log(response);
        setSnackbar({
          open: true,
          message: response.bookingId || 'Invalid booking confirmation received. Please try again.',
          severity: 'error'
        });
      }
    } catch (err: any) {
      // Get the exact error message from the backend response
      const errorResponse = err.response?.data;
      const errorMessage = errorResponse?.message || 'An unexpected error occurred';
      
      setOtpAttempts(prev => prev + 1);
      
      if (otpAttempts >= MAX_OTP_ATTEMPTS - 1) {
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
        setIsOtpModalOpen(false);
        setOtpAttempts(0);
      } else {
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
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
              label="Card Number"
              value={paymentInfo.cardNumber}
              onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
            />
            <div className="card__expiry">
              <CustomInput
                type="text"
                label="Exp MM"
                value={paymentInfo.expiryMonth}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryMonth: e.target.value })}
                width="10.25rem"
              />
              <CustomInput
                type="text"
                label="Exp YY"
                value={paymentInfo.expiryYear}
                onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryYear: e.target.value })}
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
          <CustomCheckboxes />
          <div className="bottom__component">
            <div className="total__amount">
              <p>Total Due:</p>
              <p>${financialData?.dueNow}</p>
            </div>
            <div className="disable__button">
              <p className="edit-link" onClick={handleBack}>Edit Billing Info</p>
              <button disabled={!isValid || isLoading} onClick={handlePurchase}>
                <p>{isLoading ? 'Processing...' : 'Purchase'}</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => {
          setIsOtpModalOpen(false);
          setOtpAttempts(0);
        }}
        onConfirm={handleOtpConfirm}
      />
      <LoaderModal isOpen={isLoading} text="Processing payment..." />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            backgroundColor: snackbar.severity === 'success' ? '#26266D' : '#EF4444',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};
