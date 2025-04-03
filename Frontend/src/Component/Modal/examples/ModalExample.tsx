import { type FC } from 'react';
import CircusPromotionModal from '../CircusPromotion/CircusPromotionModal';
import RateBreakdownModal from '../RateBreakdown/RateBreakdownModal';
import TermsAndConditionsModal from '../TermsAndCondition/TermsAndConditionsModal';
import OtpModal from '../OtpModal/OtpModal';
import { useModal } from '../../../Config/CustomHooks/UseModal';
import styles from './ModalExample.module.scss';

const ModalExample: FC = () => {
  const promotionModal = useModal();
  const rateBreakdownModal = useModal();
  const termsModal = useModal();
  const otpModal = useModal();

  const rateBreakdownData = { 
    roomType: 'Room type',
    rateTitle: 'Nightly Rate (per room)',
    promotionTitle: 'Circus savings promotion',
    dailyRates: [
      { date: 'Wednesday, March 9, 2022', amount: 132 },
      { date: 'Wednesday, March 10, 2022', amount: 132 },
      { date: 'Wednesday, March 11, 2022', amount: 100 },
      { date: 'Wednesday, March 12, 2022', amount: 132 },
      { date: 'Wednesday, March 13, 2022', amount: 132 },
      { date: 'Wednesday, March 14, 2022', amount: 132 },
      { date: 'Wednesday, March 15, 2022', amount: 132 },
      { date: 'Wednesday, March 16, 2022', amount: 132 },
    ],
    roomTotal: 1024,
    taxes: [
      { name: 'Resort fee', amount: 132 },
      { name: 'Occupancy tax', amount: 132 },
    ],
    dueNow: 400,
    dueAtResort: 1288,
  };

  const promotionData = {
    title: 'Circus Saving Promotion',
    description: 'Experience the magic of savings with our special circus-themed promotion! Limited time offers that will make your wallet smile.',
    footer: {
      title: 'Total Savings',
      price: 2570.6,
    },
  };

  const termsContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

  const handleOtpConfirm = (otp: string) => {
    console.log('OTP Confirmed:', otp);
    otpModal.closeModal();
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => promotionModal.openModal('SMALL')}
        className={styles.button}
      >
        Open Promotion Modal
      </button>

      <button
        onClick={() => rateBreakdownModal.openModal('MEDIUM')}
        className={styles.button}
      >
        Show Rate Breakdown
      </button>

      <button
        onClick={() => termsModal.openModal('LARGE')}
        className={styles.button}
      >
        Show Terms & Conditions
      </button>

      <button
        onClick={() => otpModal.openModal('OTP')}
        className={styles.button}
      >
        Cancel Booking
      </button>

      {/* Circus Promotion Modal */}
      <CircusPromotionModal
        isOpen={promotionModal.isOpen}
        onClose={promotionModal.closeModal}
        title={promotionData.title}
        description={promotionData.description}
        footer={promotionData.footer}
      />

      {/* Rate Breakdown Modal */}
      <RateBreakdownModal
        isOpen={rateBreakdownModal.isOpen}
        onClose={rateBreakdownModal.closeModal}
        {...rateBreakdownData}
      />

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={termsModal.isOpen}
        onClose={termsModal.closeModal}
        content={termsContent}
      />

      {/* OTP Modal */}
      <OtpModal
        isOpen={otpModal.isOpen}
        onClose={otpModal.closeModal}
        onConfirm={handleOtpConfirm}
      />
    </div>
  );
};

export default ModalExample;