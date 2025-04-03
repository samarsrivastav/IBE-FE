import { useState } from "react";
import { Heading } from "../../Heading/Heading";
import CustomInput from "../../Utils/CustomInput";
import "./BillingInfo.scss";
import CustomDropdown from "../../Utils/CustomDropdown";
import { countryData, statesByCountry } from "../countryData";

export const BillingInfo = () => {
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

  const countryKeys = Object.keys(statesByCountry) as (keyof typeof statesByCountry)[];

  return (
    <div className="billing__container">
      <Heading title="2. Billing Info" />
      <div className="billing__inputs">
        <div className="input full__name">
          <CustomInput
            type="text"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <CustomInput
            type="text"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="input address">
          <CustomInput
            type="text"
            label="Mailing Address1"
            value={mailingAddress1}
            onChange={(e) => setMailingAddress1(e.target.value)}
          />
          <CustomInput
            type="text"
            label="Mailing Address2"
            value={mailingAddress2}
            onChange={(e) => setMailingAddress2(e.target.value)}
          />
        </div>
        <div className="input">
          <CustomDropdown
            label="Country"
            options={countryData}
            value={selectedCountryOption}
            onChange={setSelectedCountryOption}
            required
          />
        </div>
        <div className="input city-details">
          <CustomInput
            type="text"
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
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
              required
              width="11.5625rem"
            />
            <CustomInput
              type="text"
              label="Zip"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              width="9.0625rem"
            />
          </div>
        </div>
        <div className="input phone">
          <CustomInput
            label="Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="input email">
          <CustomInput
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="disable__button">
        <p className="edit-link">Edit Traveler Info. </p>
        <button>
          <p>Next: Payment Info</p>
        </button>
      </div>
    </div>
  );
};
