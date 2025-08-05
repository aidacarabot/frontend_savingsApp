import { useState, useEffect } from 'react';
import { fetchData } from '../utils/api/fetchData';

const useProfilePicChange = () => {
  const [imageSrc, setImageSrc] = useState("../../assets/default-profile.png");
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar el loader

  const fetchProfilePicture = async () => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      console.error('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      // Obtener los datos del usuario desde el backend
      const userData = await fetchData(`/users/${userId}`, 'GET', null, {
        'Authorization': `Bearer ${token}`,
      });

      // Actualizar la imagen si existe un enlace en el backend
      if (userData.profilePicture) {
        setImageSrc(userData.profilePicture);
      }
    } catch (err) {
      console.error('Error fetching profile picture:', err);
    } finally {
      setIsLoading(false); // Ocultar el loader después de cargar la imagen
    }
  };

  const handleImageChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImageSrc(URL.createObjectURL(selectedFile)); // Mostrar vista previa de la imagen

      const formData = new FormData();
      formData.append('profilePicture', selectedFile); // El nombre del campo debe coincidir con el backend

      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        alert('User not authenticated');
        return;
      }

      try {
        setIsLoading(true); // Mostrar el loader mientras se sube la imagen
        // Subir la imagen al backend
        await fetchData(`/users/${userId}`, 'PUT', formData, {
          'Authorization': `Bearer ${token}`,
        });

        alert('Profile picture updated successfully!');
        // Volver a obtener la imagen actualizada desde el backend
        await fetchProfilePicture();
      } catch (err) {
        console.error('Error updating profile picture:', err);
        alert('Failed to update profile picture. Please try again.');
      } finally {
        setIsLoading(false); // Ocultar el loader después de la subida
      }
    }
  };

  useEffect(() => {
    // Obtener la imagen actual al cargar el componente
    fetchProfilePicture();
  }, []);

  return { imageSrc, handleImageChange, isLoading };
};

export default useProfilePicChange;