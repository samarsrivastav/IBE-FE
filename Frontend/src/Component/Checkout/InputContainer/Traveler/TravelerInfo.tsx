import { useState } from "react";
import { Heading } from "../../Heading/Heading";
import CustomInput from "../../Utils/CustomInput";
import "./TravelerInfo.scss";

interface TravelerInfoProps {
  isOpen: boolean;
  setIsBillingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTravelerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TravelerInfo = ({
  isOpen,
  setIsBillingOpen,
  setIsTravelerOpen,
}: TravelerInfoProps) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [error,setError]=useState<string|null>(null)
  
  const isFormValid = firstName.trim() && lastName.trim() && email.trim() && phone.trim() && (error===null);

  const handleAccordianState = () => {
    if (isFormValid) {
      setIsBillingOpen(true);
      setIsTravelerOpen(false);
    }
  };

  return (
    <div className={`traveler__container ${isOpen ? "open" : "closed"}`}>
      <Heading title="1. Traveler Info" />
      <div className="traveler__inputs">
        <div className="input full__name">
          <CustomInput
            type="text"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            setError={setError}
          />
          <CustomInput
            type="text"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            setError={setError}
          />
        </div>
        <div className="input phone">
          <CustomInput
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            setError={setError}
          />
        </div>
        <div className="input email">
          <CustomInput
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            setError={setError}
          />
        </div>
      </div>
      <div className="disable__button">
        <button onClick={handleAccordianState} disabled={!isFormValid}>
          <p>Next: Billing Info</p>
        </button>
      </div>
    </div>
  );
};
