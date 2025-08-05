import useApiFetch from "../../hooks/useApiFetch";
import useCalculateAge from "../../hooks/useCalculateAge";
import useProfileEditor from "../../hooks/useProfileEditor";
import Button from "../Button/Button";
import Loader from "../Loader/Loader";
import './PersonalInfoForm.css';

const PersonalInfoForm = () => {
    const { responseData, loading, error, refetch } = useApiFetch('/users', 'GET'); 

  const {
    isEditingProfile,
    setIsEditingProfile,
    editedProfile,
    handleProfileChange,
    handleSave
  } = useProfileEditor(responseData, refetch);

  const age = useCalculateAge(responseData?.birthDate);

  const expenses = responseData?.monthlyExpectedExpenses || {};
  const totalExpectedExpenses = responseData?.totalExpectedExpenses || 0;

  if (loading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className='personal-info-form'>
      <p className='name'>{responseData?.name}</p>
      <p className='age'>Age: {age}</p>
      <p className='monthly-salary'>
        Monthly Salary:
        {isEditingProfile ? (
          <input
            type='text'
            inputMode='decimal'
            pattern='[0-9]*'
            value={
              editedProfile.monthlySalary === '0'
                ? ''
                : editedProfile.monthlySalary
            }
            onChange={(e) =>
              handleProfileChange(
                'monthlySalary',
                e.target.value.replace(/[^0-9.]/g, '')
              )
            }
            style={{ marginLeft: '10px', width: '100px' }}
            placeholder='Enter salary'
            autoComplete='off'
          />
        ) : (
          <>${responseData?.monthlySalary}</>
        )}
      </p>

      <h3 className='expected-monthly-expenses'>
        Expected Expenses per Category:
      </h3>
      <ul className='expected-expenses-list'>
        {(isEditingProfile
          ? Object.entries(editedProfile.monthlyExpectedExpenses)
          : Object.entries(expenses)
        ).map(([category, amount]) => (
          <li key={category}>
            {category}:
            {isEditingProfile ? (
              <input
                type='text'
                inputMode='decimal'
                pattern='[0-9]*'
                value={amount === 0 ? '' : amount}
                min='0'
                onChange={(e) =>
                  handleProfileChange(
                    'monthlyExpectedExpenses',
                    e.target.value.replace(/[^0-9.]/g, ''),
                    category
                  )
                }
                style={{ marginLeft: '10px', width: '80px' }}
                placeholder='0'
                autoComplete='off'
              />
            ) : (
              <span style={{ marginLeft: '10px' }}>${amount}</span>
            )}
          </li>
        ))}
      </ul>

      <p className='total-expected-expenses'>
        Total Expected Expenses: ${totalExpectedExpenses}
      </p>

      <div className='buttons-profile'>
        {!isEditingProfile && (
          <Button
            text='Edit Profile'
            onClick={() => setIsEditingProfile(true)}
          />
        )}
        {isEditingProfile && <Button text='Save' onClick={handleSave} />}
      </div>
    </div>
  )
}

export default PersonalInfoForm