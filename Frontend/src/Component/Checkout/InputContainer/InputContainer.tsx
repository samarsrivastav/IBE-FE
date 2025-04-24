import { TravelerInfo } from "./Traveler/TravelerInfo"
import "./InputContainer.scss"
import { BillingInfo } from "./BillingInfo/BillingInfo"
import { PaymentInfo } from "./PaymentInfo/PaymentInfo"
import { useState } from "react"

export const InputContainer = () => {
  const [isBillingOpen, setIsBillingOpen] = useState<boolean>(false);
  const [isTravelerOpen, setIsTravelerOpen] = useState<boolean>(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  return (
    <div className="input__container">
        <h1>Payment Info</h1>
        <TravelerInfo isOpen={isTravelerOpen} setIsBillingOpen={setIsBillingOpen} setIsTravelerOpen={setIsTravelerOpen}/>
        <BillingInfo isBillingOpen={isBillingOpen} setIsBillingOpen={setIsBillingOpen} setIsTravelerOpen={setIsTravelerOpen} setIsPaymentOpen={setIsPaymentOpen}/>
        <PaymentInfo isOpen={isPaymentOpen} setIsPaymentOpen={setIsPaymentOpen} setIsBillingOpen={setIsBillingOpen}/>
    </div>
  )
}
