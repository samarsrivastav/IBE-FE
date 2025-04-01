import React from "react";
import styles from "./StepsIndicator.module.scss";

interface StepIndicatorProps {
  step: number;
}

const StepsIndicator: React.FC<StepIndicatorProps> = ({ step }) => {
  return (
    <div className={styles.steps}>
      <div className={styles.steps__content}>
        <div className={styles.steps__item}>
          <div
            className={`${styles.steps__circle} ${
              step >= 1 && styles["steps__circle--completed"]
            } ${step === 1 && styles["steps__circle--current"]}`}
          >
            {step >= 1 && (
              <svg width="16" height="15" viewBox="0 0 24 24" fill="none" className={styles.roundedCheckmark}>
                <path
                  d="M9 16.17 5.53 12.7a.996.996 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41a.996.996 0 0 0-1.41 0z"
                  fill="white"
                  transform="scale(0.895 0.813) translate(2 3)"
                />
              </svg>
            )}
          </div>
        </div>
        <div className={`${styles.steps__connector} ${step > 1 && styles["steps__connector--completed"]}`}></div>
        <div className={styles.steps__item}>
          <div
            className={`${styles.steps__circle} ${
              step >= 2 && styles["steps__circle--completed"]
            } ${step === 2 && styles["steps__circle--current"]}`}
          >
            {step >= 2 && (
              <svg width="16" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 16.17 5.53 12.7a.996.996 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41a.996.996 0 0 0-1.41 0z"
                  fill="white"
                  transform="scale(0.895 0.813) translate(2 3)"
                />
              </svg>
            )}
          </div>
        </div>
        <div className={`${styles.steps__connector} ${step === 3 && styles["steps__connector--completed"]}`}></div>
        <div className={styles.steps__item}>
          <div
            className={`${styles.steps__circle} ${
              step === 3 && styles["steps__circle--current"]
            }`}
          >
            {step >= 3 && (
              <svg width="16" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 16.17 5.53 12.7a.996.996 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41a.996.996 0 0 0-1.41 0z"
                  fill="white"
                  transform="scale(0.895 0.813) translate(2 3)"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
      <div className={styles.steps__labels}>
        <div className={`${step !== 1 && styles.steps__label} ${step === 1 && styles.steps__activelabel}`}>1: {("Choose room")}</div>
        <div className={`${step !== 2 && styles.steps__label} ${step === 2 && styles.steps__activelabel}`}>2. {("Choose add on")}</div>
        <div className={`${step !== 3 && styles.steps__label} ${step === 3 && styles.steps__activelabel}`}>3: {("Checkout")}</div>
      </div>
    </div>
  );
};

export default StepsIndicator;
