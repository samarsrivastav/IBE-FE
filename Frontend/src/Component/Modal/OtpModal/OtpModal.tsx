import { type FC, useState } from "react";
import BaseModal from "../BaseModal/BaseModal";
import { MODAL_CONFIGS } from "../types";
import styles from './OtpModal.module.scss';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (otp: string) => void;
}

const OtpModal: FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const modalConfig = MODAL_CONFIGS.OTP;

  const validateOtp = (value: string): string => {
    if (!value) return "OTP is required";
    if (!/^\d+$/.test(value)) return "OTP must contain only numbers";
    if (value.length !== 6) return "OTP must be 6 digits";
    return "";
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtp(value);
    if (touched) {
      setError(validateOtp(value));
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateOtp(otp));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const validationError = validateOtp(otp);
    if (validationError) {
      setError(validationError);
      return;
    }
    onConfirm(otp);
  };

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      width={modalConfig.width}
      height={modalConfig.height}
    >
      <div className={styles.modalContainer}>
        <div className={styles.contentContainer}>
          {/* Header */}
          <h2 className={styles.header}>
            Enter OTP for cancelling the room booking
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                onBlur={handleBlur}
                className={`${styles.input} ${touched && error ? styles.error : ''}`}
                placeholder=""
                maxLength={6}
                pattern="\d*"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
              />
              {touched && error && (
                <p className={styles.errorMessage}>
                  {error}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Button Container */}
        <div className={styles.buttonContainer}>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={touched && !!error}
            className={`${styles.button} ${touched && error ? styles.disabled : ''}`}
          >
            <p>CONFIRM OTP</p>
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default OtpModal;