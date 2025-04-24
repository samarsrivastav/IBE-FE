import { type FC } from "react";
import BaseModal from "../BaseModal/BaseModal";
import { MODAL_CONFIGS } from "../types";
import styles from './RateBreakdownModal.module.scss';

interface RateItem {
  date: string;
  amount: number;
}

interface TaxItem {
  name: string;
  amount: number;
}

interface RateBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomType: string;
  rateTitle: string;
  promotionTitle: string;
  dailyRates: RateItem[];
  roomTotal: number;
  taxes: TaxItem[];
  dueNow: number;
  dueAtResort: number;
}

const RateBreakdownModal: FC<RateBreakdownModalProps> = ({
  isOpen,
  onClose,
  roomType,
  rateTitle,
  promotionTitle,
  dailyRates,
  roomTotal,
  taxes,
  dueNow,
  dueAtResort,
}) => {
  const modalConfig = MODAL_CONFIGS.MEDIUM;

  const formatCurrency = (amount: number): string => {
    return `$${amount}`;
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      width={modalConfig.width}
    >
      <div className={styles.modalContainer}>
        <div className={styles.contentContainer}>
          {/* Header */}
          <h2 className={styles.header}>Rate Breakdown</h2>

          {/* Room Type Section */}
          <div className={styles.roomTypeSection}>
            <p className={styles.roomType}>{roomType}</p>
            <p className={styles.rateTitle}>{rateTitle}</p>
          </div>

          {/* Promotion Title */}
          <p className={styles.promotionTitle}>{promotionTitle}</p>

          {/* Daily Rates */}
          <div className={styles.dailyRates}>
            {dailyRates.map((rate, index) => (
              <div key={index} className={styles.rateItem}>
                <span className={styles.rateDate}>{rate.date}</span>
                <span className={styles.rateAmount}>
                  {formatCurrency(rate.amount)}
                </span>
              </div>
            ))}
          </div>

          {/* Room Total */}
          <div className={styles.roomTotal}>
            <span className={styles.totalLabel}>Room Total</span>
            <span className={styles.totalAmount}>
              {formatCurrency(roomTotal)}
            </span>
          </div>

          {/* Taxes and Fees Section */}
          <div className={styles.taxesSection}>
            <p className={styles.taxTitle}>Taxes and fees (per room)</p>
            {taxes.map((tax, index) => (
              <div key={index} className={styles.taxItem}>
                <span className={styles.taxName}>{tax.name}</span>
                <span className={styles.taxAmount}>
                  {formatCurrency(tax.amount)}
                </span>
              </div>
            ))}
          </div>

          {/* Payment Breakdown */}
          <div className={styles.paymentBreakdown}>
            <div className={styles.paymentItem}>
              <span className={styles.paymentLabel}>Due now</span>
              <span className={styles.paymentAmount}>
                {formatCurrency(dueNow)}
              </span>
            </div>
            <div className={styles.paymentItem}>
              <span className={styles.paymentLabel}>Due at resort</span>
              <span className={styles.paymentAmount}>
                {formatCurrency(dueAtResort)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default RateBreakdownModal;
