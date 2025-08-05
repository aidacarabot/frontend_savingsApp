import ProfilePictureEdit from '../components/ProfilePictureEdit/ProfilePictureEdit';
import PersonalInfoForm from '../components/PersonalInfoForm/PersonalInfoForm';

const User = () => {

  return (
    <div className='user-container'>
      <ProfilePictureEdit />
      <PersonalInfoForm />
    </div>
  )
};

export default User;
