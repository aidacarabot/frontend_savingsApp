import { useState, useEffect } from 'react';
import { fetchData } from '../utils/api/fetchData';

const useProfilePicChange = () => {
  const [imageSrc, setImageSrc] = useState("../../assets/default-profile.png");
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProfilePicture = async () => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      console.error('User not authenticated');
      setIsLoading(false);
      return;
    }

    try {
      
      const userData = await fetchData(`/users/${userId}`, 'GET', null, {
        'Authorization': `Bearer ${token}`,
      });

      
      if (userData.profilePicture) {
        setImageSrc(userData.profilePicture);
      }
    } catch (err) {
      console.error('Error fetching profile picture:', err);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleImageChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImageSrc(URL.createObjectURL(selectedFile)); 

      const formData = new FormData();
      formData.append('profilePicture', selectedFile); 

      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
        setErrorMessage('User not authenticated');
        return;
      }

      try {
        setIsLoading(true); 
        
        await fetchData(`/users/${userId}`, 'PUT', formData, {
          'Authorization': `Bearer ${token}`,
        });

        setSuccessMessage('Profile picture updated successfully!');
        
        await fetchProfilePicture();
      } catch (err) {
        console.error('Error updating profile picture:', err);
        setErrorMessage('Failed to update profile picture. Please try again.');
      } finally {
        setIsLoading(false); 
      }
    }
  };

  useEffect(() => {
    
    fetchProfilePicture();
  }, []);

  return { imageSrc, handleImageChange, isLoading, successMessage, errorMessage };
};

export default useProfilePicChange;