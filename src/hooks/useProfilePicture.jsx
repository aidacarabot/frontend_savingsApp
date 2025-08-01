import { useState } from "react";

const useProfilePicture = (initialImage) => {
  const [profilePicture, setProfilePicture] = useState(initialImage);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Simulamos la imagen subida (esto debería reemplazarse con la URL real del backend)
      setProfilePicture(imageUrl);
      setIsEditing(false);
    }
  };

  return {
    profilePicture,
    isEditing,
    setIsEditing,
    handleImageChange
  };
};

export default useProfilePicture;