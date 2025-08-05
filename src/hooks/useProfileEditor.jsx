import { useState, useEffect } from "react";
import { fetchData } from "../utils/api/fetchData";

const useProfileEditor = (responseData, refetch) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    monthlySalary: '',
    monthlyExpectedExpenses: {},
    profilePicture: ''
  });

  useEffect(() => {
    setEditedProfile({
      monthlySalary: responseData?.monthlySalary?.toString() || '',
      monthlyExpectedExpenses: responseData?.monthlyExpectedExpenses || {},
      profilePicture: responseData?.profilePicture || '/assets/default-profile.png'
    });
  }, [responseData]);

  const handleProfileChange = (field, value, category = null) => {
    if (field === 'monthlyExpectedExpenses' && category) {
      setEditedProfile(prev => ({
        ...prev,
        monthlyExpectedExpenses: {
          ...prev.monthlyExpectedExpenses,
          [category]: value === '' ? 0 : Number(value)
        }
      }));
    } else {
      setEditedProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      const salaryToSend = editedProfile.monthlySalary === '' ? 0 : Number(editedProfile.monthlySalary);

      await fetchData(`/users/${responseData._id}`, 'PUT', {
        monthlySalary: salaryToSend,
        monthlyExpectedExpenses: editedProfile.monthlyExpectedExpenses,
        profilePicture: editedProfile.profilePicture
      });

      setIsEditingProfile(false);
      refetch(); // Refresca los datos del usuario sin recargar la página
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  return {
    isEditingProfile,
    setIsEditingProfile,
    editedProfile,
    handleProfileChange,
    handleSave
  };
};

export default useProfileEditor;

