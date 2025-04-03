import { TravelerInfo } from "./Traveler/TravelerInfo"
import "./InputContainer.scss"
import { BillingInfo } from "./BillingInfo/BillingInfo"
import { PaymentInfo } from "./PaymentInfo/PaymentInfo"

export const InputContainer = () => {
  return (
    <div className="input__container">
        <h1>Payment Info</h1>
        <TravelerInfo/>
        <BillingInfo/>
        <PaymentInfo/>
    </div>
  )
}
