import { useState, useCallback } from 'react';
import { ModalType } from '../../Component/Modal/types';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const openModal = useCallback((modalType: ModalType) => {
    setActiveModal(modalType);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setActiveModal(null);
  }, []);

  return {
    isOpen,
    activeModal,
    openModal,
    closeModal,
  };
};