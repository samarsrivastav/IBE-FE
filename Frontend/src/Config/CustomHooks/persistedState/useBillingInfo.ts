import { useState } from "react";

const LOCAL_STORAGE_KEY = "billingInfo";

const useBillingForm = () => {
  const [form, setForm] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      mailingAddress1: "",
      mailingAddress2: "",
      city: "",
      zipCode: "",
      country: "",
      state: ""
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
