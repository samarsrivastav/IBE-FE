import { useEffect } from "react";
import StepsIndicator from "../../Component/RoomResults/StepsIndicator/StepsIndicator";
import { InputContainer } from "../../Component/Checkout/InputContainer/InputContainer";
import "./Checkout.scss";
import { AsideComponent } from "../../Component/Checkout/AsideComponent/AsideComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { setStep } from "../../Redux/slice/stepSlice";
import Timer from "../../Component/Timer/Timer";
import { useNavigate } from "react-router-dom";
import useAnalytics from "../../Hooks/useAnalytics";

export const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentStep = useSelector((state: RootState) => state.step.step);
  const analytics = useAnalytics();

  useEffect(() => {
    const storedStep = localStorage.getItem("step");
    if (storedStep) {
      dispatch(setStep(Number(storedStep))); // Sync state with localStorage
    }
    
    // Track checkout page view with the current step
    analytics.logEvent('Checkout', 'View', `Step ${currentStep}`);
  }, [dispatch, currentStep, analytics]);

  // Track step changes
  useEffect(() => {
    analytics.logEvent('Checkout', 'StepChange', `Step ${currentStep}`);
  }, [currentStep, analytics]);

  const handleTimeout = () => {
    // Track timeout event
    analytics.logEvent('Checkout', 'Timeout', 'Session Expired');
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <StepsIndicator step={currentStep} />
      <div className="checkout-page">
        <div className="checkout-page__content">
          <InputContainer />
        </div>
        <div className="checkout-page__aside">
          <AsideComponent />
        </div>
        <Timer initialTime={600} onTimeout={handleTimeout} />
      </div>
    </>
  );
};