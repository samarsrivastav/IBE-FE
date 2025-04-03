import { type FC } from "react";
import BaseModal from "../BaseModal/BaseModal";
import { MODAL_CONFIGS } from "../types";
import styles from "./TermsAndConditionsModal.module.scss";

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

const TermsAndConditionsModal: FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose,
  content,
}) => {
  const modalConfig = MODAL_CONFIGS.LARGE;

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} width={modalConfig.width}>
      <div className={styles.modalContainer}>
        <div className={styles.contentContainer}>
          {/* Header */}
          <h2 className={styles.header}>Terms and Conditions</h2>

          {/* Content */}
          <div className={styles.content}>{content}</div>
        </div>
      </div>
    </BaseModal>
  );
};

export default TermsAndConditionsModal;
