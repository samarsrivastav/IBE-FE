import { Heading } from "../../Heading/Heading";
import CustomInput from "../../Utils/CustomInput";
import "./TravelerInfo.scss";
import { useTravelerInfo } from "../../../../Config/CustomHooks/persistedState/useTravellerInfo";

interface TravelerInfoProps {
  isOpen: boolean;
  setIsBillingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTravelerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TravelerInfo = ({ isOpen, setIsBillingOpen, setIsTravelerOpen }: TravelerInfoProps) => {
  const { travelerInfo, setTravelerInfo, isValid, error, setError } = useTravelerInfo();

  const handleNext = () => {
    if (isValid) {
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
            value={travelerInfo.firstName}
            onChange={(e) =>
              setTravelerInfo({ ...travelerInfo, firstName: e.target.value })
            }
            setError={setError}
          />
          <CustomInput
            type="text"
            label="Last Name"
            value={travelerInfo.lastName}
            onChange={(e) =>
              setTravelerInfo({ ...travelerInfo, lastName: e.target.value })
            }
            setError={setError}
          />
        </div>
        <div className="input phone">
          <CustomInput
            label="Phone"
            type="tel"
            value={travelerInfo.phone}
            onChange={(e) =>
              setTravelerInfo({ ...travelerInfo, phone: e.target.value })
            }
            setError={setError}
          />
        </div>
        <div className="input email">
          <CustomInput
            type="email"
            label="Email"
            value={travelerInfo.email}
            onChange={(e) =>
              setTravelerInfo({ ...travelerInfo, email: e.target.value })
            }
            setError={setError}
          />
        </div>
      </div>
      <div className="disable__button">
        <button onClick={handleNext} disabled={!isValid}>
          <p>Next: Billing Info</p>
        </button>
      </div>
    </div>
  );
};
