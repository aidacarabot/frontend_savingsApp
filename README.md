import { useState, useEffect } from "react"
import useApiFetch from '../hooks/useApiFetch';
import useProfilePicture from "../hooks/useProfilePicture";
import { fetchData } from '../utils/api/fetchData';
import useCalculateAge from "../hooks/useCalculateAge";
import Loader from "../components/Loader/Loader";


const User = () => {

  const { responseData, loading, error } = useApiFetch('/users', 'GET'); 
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedSalary, setEditedSalary] = useState(responseData?.monthlySalary?.toString() || '');
  const [expenses, setExpenses] = useState(responseData?.monthlyExpectedExpenses || {});
  
  // Calculamos la edad
  const age = useCalculateAge(responseData?.birthDate);

  // Gestión de la imagen de perfil
  const { profilePicture, isEditing, setIsEditing, handleImageChange } = useProfilePicture(responseData?.profilePicture || '/assets/default-profile.png');

  // Actualiza el salario editable cuando cambie la respuesta
  useEffect(() => {
    setEditedSalary(responseData?.monthlySalary?.toString() || '');
  }, [responseData]);

  const handleSave = async () => {
    try {
      // Solo actualiza si hay un número válido
      const salaryToSend = editedSalary === '' ? 0 : Number(editedSalary);

      await fetchData(`/users/${responseData._id}`, 'PUT', {
        monthlySalary: salaryToSend,
        // profilePicture: ... si quieres actualizar la imagen también
      });

      setIsEditingProfile(false);
      // Opcional: recarga los datos del usuario aquí si quieres ver el cambio reflejado
      // window.location.reload(); // O usa una función para refrescar los datos
    } catch (err) {
      console.error('Error updating salary:', err);
    }
  };
  
    const expenses = responseData?.monthlyExpectedExpenses || {};
  const totalExpectedExpenses = responseData?.totalExpectedExpenses || 0;

  // Función para obtener el emoji según la categoría
  const getCategoryEmoji = (category) => {
    const emojis = {
      Home: '🏠',
      Transportation: '🚗',
      Groceries: '🛒',
      Health: '🏥',
      Entertainment: '🎭',
      Travel: '✈️',
      Subscriptions: '💳',
      Shopping: '🛍️',
      Education: '📚',
      Gifts: '🎁',
      Debt: '🏦',
      Leisure: '🍸',
      Other: '❓'
    };
    return emojis[category] || '';
  };

  if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='user-container'>
      <img 
        src={profilePicture} 
        alt="Profile"
        className="user-picture"
        onMouseEnter={() => setIsEditing(true)}
        onMouseLeave={() => setIsEditing(false)}
      />
      {isEditing && <span>Edit</span>}
      {isEditing && (
        <input type="file" onChange={handleImageChange} />
      )}
      
      <p>{responseData?.name}</p>
      <p>Age: {age}</p>
      <p>
        Monthly Salary: 
        {isEditingProfile ? (
          <input
            type="number"
            value={editedSalary}
            onChange={e => setEditedSalary(e.target.value)}
            style={{ marginLeft: '10px', width: '100px' }}
            min="0"
            step="any"
            placeholder="Enter salary"
          />
        ) : (
          <>${responseData?.monthlySalary}</>
        )}
      </p>
      
      <h3>Expenses per Category:</h3>
      <ul>
        {Object.entries(expenses).map(([category, amount]) => (
          <li key={category}>
            {getCategoryEmoji(category)} {category}:
            <span style={{ marginLeft: '10px' }}>${amount}</span>
          </li>
        ))}
      </ul>

      <p>Total Expected Expenses: ${totalExpectedExpenses}</p>

      <div className='buttons-profile'>
        <button onClick={() => setIsEditingProfile(true)}>
          Edit Profile
        </button>
        <button 
          onClick={handleSave} 
          disabled={!isEditingProfile}
          style={{ 
            backgroundColor: isEditingProfile ? '#4CAF50' : '#ccc',
            cursor: isEditingProfile ? 'pointer' : 'not-allowed'
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default User;
