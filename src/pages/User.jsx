import { useState, useEffect } from "react";
import useApiFetch from '../hooks/useApiFetch';
import { fetchData } from '../utils/api/fetchData';
import useCalculateAge from "../hooks/useCalculateAge";
import Loader from "../components/Loader/Loader";

const User = () => {
  const { responseData, loading, error, refetch } = useApiFetch('/users', 'GET'); 
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    monthlySalary: '',
    monthlyExpectedExpenses: {},
    profilePicture: ''
  });
  const [isEditingPicture, setIsEditingPicture] = useState(false);

  // Calcula la edad
  const age = useCalculateAge(responseData?.birthDate);

  // Actualiza el perfil editable cuando cambie la respuesta
  useEffect(() => {
    setEditedProfile({
      monthlySalary: responseData?.monthlySalary?.toString() || '',
      monthlyExpectedExpenses: responseData?.monthlyExpectedExpenses || {},
      profilePicture: responseData?.profilePicture || '/assets/default-profile.png'
    });
  }, [responseData]);

  // Handler único para cualquier campo
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

  // Imagen de perfil
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

  const expenses = responseData?.monthlyExpectedExpenses || {};
  const totalExpectedExpenses = responseData?.totalExpectedExpenses || 0;

  if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='user-container'>
      <img 
        src={isEditingProfile ? editedProfile.profilePicture : responseData?.profilePicture || '/assets/default-profile.png'} 
        alt="Profile"
        className="user-picture"
        onMouseEnter={() => setIsEditingPicture(true)}
        onMouseLeave={() => setIsEditingPicture(false)}
      />
      {isEditingPicture && isEditingProfile && (
        <input type="file" onChange={handleImageChange} />
      )}
      {isEditingPicture && <span>Edit</span>}
      
      <p>{responseData?.name}</p>
      <p>Age: {age}</p>
      <p>
        Monthly Salary: 
        {isEditingProfile ? (
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9]*"
            value={editedProfile.monthlySalary === '0' ? '' : editedProfile.monthlySalary}
            onChange={e => handleProfileChange('monthlySalary', e.target.value.replace(/[^0-9.]/g, ''))}
            style={{ marginLeft: '10px', width: '100px' }}
            placeholder="Enter salary"
            autoComplete="off"
          />
        ) : (
          <>${responseData?.monthlySalary}</>
        )}
      </p>
      
      <h3>Expected Expenses per Category:</h3>
      <ul>
        {(isEditingProfile ? Object.entries(editedProfile.monthlyExpectedExpenses) : Object.entries(expenses)).map(([category, amount]) => (
          <li key={category}>
            {category}:
            {isEditingProfile ? (
              <input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                value={amount === 0 ? '' : amount}
                min="0"
                onChange={e => handleProfileChange('monthlyExpectedExpenses', e.target.value.replace(/[^0-9.]/g, ''), category)}
                style={{ marginLeft: '10px', width: '80px' }}
                placeholder="0"
                autoComplete="off"
              />
            ) : (
              <span style={{ marginLeft: '10px' }}>${amount}</span>
            )}
          </li>
        ))}
      </ul>

      <p>Total Expected Expenses: ${totalExpectedExpenses}</p>

      <div className='buttons-profile'>
        {!isEditingProfile && (
          <button onClick={() => setIsEditingProfile(true)}>
            Edit Profile
          </button>
        )}
        {isEditingProfile && (
          <button 
            onClick={handleSave} 
            style={{ 
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default User;
