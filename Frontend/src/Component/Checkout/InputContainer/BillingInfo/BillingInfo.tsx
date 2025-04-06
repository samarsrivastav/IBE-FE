import { Heading } from "../../Heading/Heading";
import CustomInput from "../../Utils/CustomInput";
import "./BillingInfo.scss";
import CustomDropdown from "../../Utils/CustomDropdown";
import { countryData, statesByCountry } from "../countryData";
import useBillingForm from "../../../../Config/CustomHooks/persistedState/useBillingInfo";

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
  const { form, updateField, error, setError } = useBillingForm();

  const {
    firstName,
    lastName,
    email,
    phone,
    mailingAddress1,
    mailingAddress2,
    city,
    zip,
    selectedCountryOption,
    selectedStateOption
  } = form;

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

  return (
    <div className="billing__container">
      <div className="billing__header">
        <Heading title="2. Billing Info" />
      </div>

      {isBillingOpen && (
        <div className="billing__content">
          <div className="billing__inputs">
            <div className="input full__name">
              <CustomInput label="First Name" value={firstName} onChange={e => updateField("firstName", e.target.value)} setError={setError} />
              <CustomInput label="Last Name" value={lastName} onChange={e => updateField("lastName", e.target.value)} setError={setError} />
            </div>
            <div className="input address">
              <CustomInput label="Mailing Address1" value={mailingAddress1} onChange={e => updateField("mailingAddress1", e.target.value)} setError={setError} />
              <CustomInput label="Mailing Address2" value={mailingAddress2} onChange={e => updateField("mailingAddress2", e.target.value)} setError={setError} />
            </div>
            <div className="input">
              <CustomDropdown
                label="Country"
                options={countryData}
                value={selectedCountryOption}
                onChange={(val) => updateField("selectedCountryOption", val)}
              />
            </div>
            <div className="input city-details">
              <CustomInput label="City" value={city} onChange={e => updateField("city", e.target.value)} setError={setError} />
              <div className="pin">
                <CustomDropdown
                  placeholder="AL"
                  label="State"
                  options={countryKeys.includes(selectedCountryOption as keyof typeof statesByCountry)
                    ? statesByCountry[selectedCountryOption as keyof typeof statesByCountry]
                    : []}
                  value={selectedStateOption}
                  onChange={(val) => updateField("selectedStateOption", val)}
                />
                <CustomInput
                  label="Zip"
                  value={zip}
                  onChange={e => updateField("zip", e.target.value)}
                  setError={setError}
                  customValidation={validateZip}
                />
              </div>
            </div>
            <div className="input phone">
              <CustomInput label="Phone" type="tel" value={phone} onChange={e => updateField("phone", e.target.value)} setError={setError} />
            </div>
            <div className="input email">
              <CustomInput label="Email" type="email" value={email} onChange={e => updateField("email", e.target.value)} setError={setError} />
            </div>
          </div>

          <div className="disable__button">
            <p className="edit-link" onClick={handleAccordianState}>Edit Traveler Info.</p>
            <button onClick={handlePaymentAccordianState} disabled={!isFormValid}>
              <p>Next: Payment Info</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
