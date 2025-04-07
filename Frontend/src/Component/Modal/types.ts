export interface ModalConfig {
  width: number;
  height?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  showCloseButton?: boolean;
  title?: string;
}

export const MODAL_CONFIGS = {
  SMALL: {
    width: 409,
    height: 238,
  },
  MEDIUM: {
    width: 409,
  },
  LARGE: {
    width: 908,
    height: 1052,
  },
  OTP: {
    width: 478,
    height: 265,
  },
} as const;

export type ModalType = keyof typeof MODAL_CONFIGS; 