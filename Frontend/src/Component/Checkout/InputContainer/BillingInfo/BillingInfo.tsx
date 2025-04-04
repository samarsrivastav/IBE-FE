import { useState, useEffect } from "react";
import { Heading } from "../../Heading/Heading";
import CustomInput from "../../Utils/CustomInput";
import "./BillingInfo.scss";
import CustomDropdown from "../../Utils/CustomDropdown";
import { countryData, statesByCountry } from "../countryData";

interface BillingInfoProp {
  setIsBillingOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBillingOpen: boolean;
  setIsTravelerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPaymentOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BillingInfo = ({
  setIsBillingOpen,
  isBillingOpen,
  setIsTravelerOpen,
  setIsPaymentOpen,
}: BillingInfoProp) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [mailingAddress1, setMailingAddress1] = useState<string>("");
  const [mailingAddress2, setMailingAddress2] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [selectedCountryOption, setSelectedCountryOption] = useState<string>("");
  const [selectedStateOption, setSelectedStateOption] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const countryKeys = Object.keys(statesByCountry) as (keyof typeof statesByCountry)[];

  const isFormValid =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    phone.trim() &&
    mailingAddress1.trim() &&
    city.trim() &&
    zip.trim() &&
    selectedCountryOption.trim() &&
    selectedStateOption.trim() &&
    error === null;

  const handleAccordianState = () => {
    setIsBillingOpen(false);
    setIsTravelerOpen(true);
  };

  const handlePaymentAccordianState = () => {
    if (isFormValid) {
      setIsBillingOpen(false);
      setIsPaymentOpen(true);
    }
  };
  const validateZip = (zipCode: string): string | null => {
    if (zipCode.length !== 6) {
      const errorMessage = "Zip code must be exactly 6 digits.";
      setError(errorMessage);
      return errorMessage;
    } else {
      setError(null);
      return null;
    }
  };
  return (
    <div className="billing__container">
      <div className="billing__header">
        <Heading title="2. Billing Info" />
      </div>

      {isBillingOpen && (
        <div className="billing__content">
          <div className="billing__inputs">
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
            <div className="input address">
              <CustomInput
                type="text"
                label="Mailing Address1"
                value={mailingAddress1}
                onChange={(e) => setMailingAddress1(e.target.value)}
                setError={setError}
              />
              <CustomInput
                type="text"
                label="Mailing Address2"
                value={mailingAddress2}
                onChange={(e) => setMailingAddress2(e.target.value)}
                setError={setError}
              />
            </div>
            <div className="input">
              <CustomDropdown
                label="Country"
                options={countryData}
                value={selectedCountryOption}
                onChange={setSelectedCountryOption}
              />
            </div>
            <div className="input city-details">
              <CustomInput
                type="text"
                label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                setError={setError}
              />
              <div className="pin">
                <CustomDropdown
                  placeholder="AL"
                  label="State"
                  options={countryKeys.includes(selectedCountryOption as keyof typeof statesByCountry)
                    ? statesByCountry[selectedCountryOption as keyof typeof statesByCountry]
                    : []
                  }
                  value={selectedStateOption}
                  onChange={setSelectedStateOption}
                />
                <CustomInput
                  type="text"
                  label="Zip"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  setError={setError}
                  customValidation={validateZip}
                />
              </div>
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
                setError={setError}
              />
            </div>
          </div>

          <div className="disable__button">
            <p className="edit-link" onClick={handleAccordianState}>
              Edit Traveler Info.
            </p>
            <button onClick={handlePaymentAccordianState} disabled={!isFormValid}>
              <p>Next: Payment Info</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
