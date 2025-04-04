import { useEffect, useState } from "react";
import StepsIndicator from "../../Component/RoomResults/StepsIndicator/StepsIndicator";
import { InputContainer } from "../../Component/Checkout/InputContainer/InputContainer";
import "./Checkout.scss"
import { AsideComponent } from "../../Component/Checkout/AsideComponent/AsideComponent";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { setStep } from "../../Redux/slice/stepSlice";
export const Checkout = () => {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.step.step);
  useEffect(() => {
    const storedStep = localStorage.getItem("step");
    if (storedStep) {
      dispatch(setStep(Number(storedStep))); // Sync state with localStorage
    }
  }, [dispatch]);
  return (
    <div className="checkout-page">
      <StepsIndicator step={currentStep} />
      <div className="checkout-page__content">
        <InputContainer />
      </div>
      <AsideComponent/>
    </div>
  )
}
