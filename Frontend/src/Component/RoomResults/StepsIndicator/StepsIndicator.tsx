import React, { useEffect } from "react";
import styles from "./StepsIndicator.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../../../Redux/slice/stepSlice";
import { RootState } from "../../../Redux/store";

interface StepIndicatorProps {
  step: number;
}

const StepsIndicator: React.FC<StepIndicatorProps> = ({ step }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.step.step);

  // Ensure step state is synced with localStorage and Redux
  useEffect(() => {
    const storedStep = localStorage.getItem("step");
    if (storedStep && currentStep !== Number(storedStep)) {
      dispatch(setStep(Number(storedStep)));
    }
  }, [dispatch, currentStep]);

  const handleReset = async () => {
    // First dispatch the step change
    dispatch(setStep(1));
    
    // Then clear storage and set new step
    localStorage.removeItem("package");
    localStorage.removeItem("selectedRoom");
    localStorage.setItem("step", "1");
    
    const searchParam = localStorage.getItem("searchParams");
    
    // Force a re-render of the steps indicator by adding a small delay before navigation
    setTimeout(() => {
      navigate("/property?" + searchParam);
    }, 0);
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep === 1) {
      handleReset();
      return;
    }

    // Only allow clicking if the step is red (current)
    if (currentStep > targetStep) {
      const searchParam = localStorage.getItem("searchParams");
      if (targetStep === 2) {
        localStorage.setItem("step", "2");
        dispatch(setStep(2));
        navigate(`/property?${searchParam}`);
      } else if (targetStep === 3) {
        localStorage.setItem("step", "3");
        dispatch(setStep(3));
        navigate("/checkout");
      }
    }
  };

  return (
    <div className={styles.steps}>
      <div className={styles.steps__content}>
        <div 
          className={`${styles.steps__item} ${styles.clickable}`}
          onClick={() => handleStepClick(1)}
          style={{ cursor: 'pointer' }}
        >
          <div
            className={`${styles.steps__circle} ${
              currentStep >= 1 && styles["steps__circle--completed"]
            } ${currentStep === 1 && styles["steps__circle--current"]}`}
          >
            {currentStep >= 1 && (
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
        <div className={`${styles.steps__connector} ${currentStep > 1 && styles["steps__connector--completed"]}`}></div>
        <div 
          className={`${styles.steps__item} ${currentStep > 2 ? styles.clickable : ''}`}
          onClick={() => handleStepClick(2)}
          style={{ cursor: currentStep > 2 ? 'pointer' : 'default' }}
        >
          <div
            className={`${styles.steps__circle} ${
              currentStep >= 2 && styles["steps__circle--completed"]
            } ${currentStep === 2 && styles["steps__circle--current"]}`}
          >
            {currentStep >= 2 && (
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
        <div className={`${styles.steps__connector} ${currentStep === 3 && styles["steps__connector--completed"]}`}></div>
        <div 
          className={`${styles.steps__item} ${currentStep > 3 ? styles.clickable : ''}`}
          onClick={() => handleStepClick(3)}
          style={{ cursor: currentStep > 3 ? 'pointer' : 'default' }}
        >
          <div
            className={`${styles.steps__circle} ${
              currentStep === 3 && styles["steps__circle--current"]
            }`}
          >
            {currentStep >= 3 && (
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
        <div 
          className={`${currentStep !== 1 && styles.steps__label} ${currentStep === 1 && styles.steps__activelabel}`}
          onClick={() => handleStepClick(1)}
          style={{ cursor: 'pointer' }}
        >
          1: {("Choose room")}
        </div>
        <div 
          className={`${currentStep !== 2 && styles.steps__label} ${currentStep === 2 && styles.steps__activelabel}`}
          onClick={() => handleStepClick(2)}
          style={{ cursor: currentStep > 2 ? 'pointer' : 'default' }}
        >
          2: {("Choose add on")}
        </div>
        <div 
          className={`${currentStep !== 3 && styles.steps__label} ${currentStep === 3 && styles.steps__activelabel}`}
          onClick={() => handleStepClick(3)}
          style={{ cursor: currentStep > 3 ? 'pointer' : 'default' }}
        >
          3: {("Checkout")}
        </div>
      </div>
    </div>
  );
};

export default StepsIndicator;
