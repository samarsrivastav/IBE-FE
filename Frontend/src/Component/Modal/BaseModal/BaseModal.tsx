import { type FC, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './BaseModal.module.scss';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width: number;
  height?: number;
  className?: string;
  hideCloseButton?: boolean;
}

const BaseModal: FC<BaseModalProps> = ({
  isOpen,
  onClose,
  children,
  width,
  height,
  className = '',
  hideCloseButton = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Convert px to rem
  const pxToRem = useCallback((px: number): string => `${px / 16}rem`, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalContainer} role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className={styles.backdrop}
        onClick={onClose}
        onKeyDown={(e): void => {
          if (e.key === 'Enter') onClose();
        }}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={`${styles.modalContent} ${className}`.trim()}
        style={{
          width: pxToRem(width),
          height: height ? pxToRem(height) : 'auto',
        }}
        role="document"
      >
        {!hideCloseButton && (
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <svg
              className={styles.closeIcon}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};

export default BaseModal;