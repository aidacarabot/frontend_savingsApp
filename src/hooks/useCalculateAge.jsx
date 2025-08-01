import { useMemo } from "react";

const useCalculateAge = (birthDate) => {
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth();
    if (month < birthDateObj.getMonth() || (month === birthDateObj.getMonth() && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

  return useMemo(() => calculateAge(birthDate), [birthDate]);
};

export default useCalculateAge;