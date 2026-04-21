import './ProfilePictureEdit.css';
import useProfilePicChange from '../../hooks/useProfilePicChange';
import Loader from '../Loader/Loader';
import { SuccessMessage, ErrorMessage } from '../Messages/Messages';

const ProfilePictureEdit = ({ isEditing = false }) => {
  const { imageSrc, handleImageChange, isLoading, successMessage, errorMessage } = useProfilePicChange();

  return (
    <>
      {successMessage && <SuccessMessage text={successMessage} />}
      {errorMessage && <ErrorMessage text={errorMessage} />}
      {isLoading ? (
        <Loader />
      ) : (
        <div className={`profile-pic${isEditing ? ' profile-pic--editing' : ''}`}>
          <img
            src={imageSrc}
            id="output"
            alt="Profile"
            className={imageSrc.includes('default-profile') ? 'default-avatar' : ''}
          />
          <label className="-label" htmlFor="file" />
          <input id="file" type="file" onChange={handleImageChange} />
        </div>
      )}
    </>
  );
};

export default ProfilePictureEdit;