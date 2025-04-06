import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "billingInfo";

const useBillingForm = () => {
  const [form, setForm] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      mailingAddress1: "",
      mailingAddress2: "",
      city: "",
      zip: "",
      selectedCountryOption: "",
      selectedStateOption: ""
    };
  });

  const [error, setError] = useState<string | null>(null);

  const updateField = (key: string, value: string) => {
    const updatedForm = { ...form, [key]: value };
    setForm(updatedForm);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedForm));
  };

  return { form, updateField, error, setError };
};

export default useBillingForm;
