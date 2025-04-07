import { type FC } from 'react';
import BaseModal from '../BaseModal/BaseModal';
import { MODAL_CONFIGS } from '../types';
import styles from './CircusPromotion.module.scss';

interface CircusPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  footer: {
    title: string;
    price: number;
  };
}

const CircusPromotionModal: FC<CircusPromotionModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  footer,
}) => {
  const modalConfig = MODAL_CONFIGS.SMALL;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      width={modalConfig.width}
      height={modalConfig.height}
    >
      <div className={styles.modalContainer}>
        {/* Content Container */}
        <div className={styles.contentContainer}>
          {/* Title */}
          <h2 className={styles.title} style={{ letterSpacing: '0' }}>
            {title}
          </h2>

          {/* Description */}
          <p className={styles.description} style={{ letterSpacing: '0' }}>
            {description}
          </p>

          {/* Footer */}
          <div className={styles.footer}>
            <div className={styles.footerContent}>
              <span className={styles.footerTitle}>{footer.title}</span>
              <span className={styles.footerPrice}>
                {formatCurrency(footer.price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default CircusPromotionModal;
