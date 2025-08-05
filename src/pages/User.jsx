import useApiFetch from '../hooks/useApiFetch';
import useCalculateAge from "../hooks/useCalculateAge";
import useProfileEditor from "../hooks/useProfileEditor";
import Loader from "../components/Loader/Loader";
import ProfilePictureEdit from '../components/ProfilePictureEdit/ProfilePictureEdit';

const User = () => {
  const { responseData, loading, error, refetch } = useApiFetch('/users', 'GET'); 

  const {
    isEditingProfile,
    setIsEditingProfile,
    editedProfile,
    setEditedProfile,
    handleProfileChange,
    handleSave
  } = useProfileEditor(responseData, refetch);

  const age = useCalculateAge(responseData?.birthDate);

  const expenses = responseData?.monthlyExpectedExpenses || {};
  const totalExpectedExpenses = responseData?.totalExpectedExpenses || 0;

  if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='user-container'>
     <ProfilePictureEdit />
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
