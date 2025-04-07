import { FC } from "react";
import BaseModal from "../Modal/BaseModal/BaseModal";
import { Loader } from "lucide-react";
import styles from './LoaderModal.module.scss';

interface LoaderModalProps {
  isOpen: boolean;
  text?: string;
}

const LoaderModal: FC<LoaderModalProps> = ({ isOpen, text = "Please wait..." }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={() => {}} width={400} >
      <div className={styles.loaderModal}>
        <Loader className={styles.spinner} />
        <p>{text}</p>
      </div>
    </BaseModal>
  );
};

export default LoaderModal;

