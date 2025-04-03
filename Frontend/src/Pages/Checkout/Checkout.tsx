import { useState } from "react";
import StepsIndicator from "../../Component/RoomResults/StepsIndicator/StepsIndicator";
import { InputContainer } from "../../Component/Checkout/InputContainer/InputContainer";
import "./Checkout.scss"
import { AsideComponent } from "../../Component/Checkout/AsideComponent/AsideComponent";
export const Checkout = () => {
  const [step, setStep] = useState<number>(
    parseInt(localStorage.getItem("step") || "3")
  );
  return (
    <div className="checkout-page">
      <StepsIndicator step={step} />
      <div className="checkout-page__content">
        <InputContainer/>
      </div>
      <AsideComponent/>
    </div>
  )
}
