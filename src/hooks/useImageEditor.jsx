import { useState } from "react";

const useImageEditor = (setEditedProfile) => {
  const [isEditingPicture, setIsEditingPicture] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile(prev => ({
          ...prev,
          profilePicture: reader.result // base64
        }));
        setIsEditingPicture(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    isEditingPicture,
    setIsEditingPicture,
    handleImageChange
  };
};

export default useImageEditor;