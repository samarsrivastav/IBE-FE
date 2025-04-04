import "./PaymentInfo.scss";
import { Heading } from "../../Heading/Heading";
import CustomInput from "../../Utils/CustomInput";
import { useState, useEffect } from "react";
import CustomCheckboxes from "../../Utils/CustomCheckBoxes";

interface PaymentInfoProps {
  isOpen: boolean;
  setIsPaymentOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBillingOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PaymentInfo = ({ isOpen, setIsPaymentOpen, setIsBillingOpen }: PaymentInfoProps) => {
  const [cardName, setCardName] = useState<string>("");
  const [expMonth, setExpMonth] = useState<string>("");
  const [expYear, setExpYear] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const requiredFields = [cardName, expMonth, expYear, cvv];
    setIsButtonDisabled(requiredFields.some((field) => !field.trim()));
  }, [cardName, expMonth, expYear, cvv]);

  const handleAccordianState = () => {
    setIsBillingOpen(true);
    setIsPaymentOpen(false);
  };

  return (
    <div className={`payment__container ${isOpen ? "open" : "closed"}`}>
      <Heading title="3. Payment Info" />
      <div className="payment__inputs">
        <div className="input card__details">
          <CustomInput type="text" label="Card Name" value={cardName} onChange={(e) => setCardName(e.target.value)} required />
          <div className="card__expiry">
            <CustomInput type="text" label="Exp MM" value={expMonth} onChange={(e) => setExpMonth(e.target.value)} width="10.25rem" required />
            <CustomInput type="text" label="Exp YY" value={expYear} onChange={(e) => setExpYear(e.target.value)} width="10.25rem" required />
          </div>
        </div>
        <div className="input">
          <CustomInput type="password" label="CVV Code" value={cvv} onChange={(e) => setCvv(e.target.value)} width="10.25rem" required />
        </div>
      </div>
      <CustomCheckboxes />
      <div className="bottom__component">
        <div className="total__amount">
          <p>Total Due:</p>
          <p>$Xxx.xx</p>
        </div>
        <div className="disable__button">
          <p className="edit-link" onClick={handleAccordianState}>Edit Billing Info</p>
          <button disabled={isButtonDisabled}>
            <p>Purchase</p>
          </button>
        </div>
      </div>
    </div>
  );
};
