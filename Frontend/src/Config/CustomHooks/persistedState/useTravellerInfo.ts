import { useEffect, useState } from "react";

export const useTravelerInfo = () => {
  const [travelerInfo, setTravelerInfo] = useState(() => {
    const stored = localStorage.getItem("travelerInfo");
    return stored ? JSON.parse(stored) : {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: ""
    };
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("travelerInfo", JSON.stringify(travelerInfo));
  }, [travelerInfo]);

  const isValid =
    travelerInfo.firstName.trim() &&
    travelerInfo.lastName.trim() &&
    travelerInfo.email.trim() &&
    travelerInfo.phoneNumber.trim() &&
    error === null;

  return {
    travelerInfo,
    setTravelerInfo,
    isValid,
    error,
    setError,
  };
};
