import './ProfilePictureEdit.css';
import useProfilePicChange from '../../hooks/useProfilePicChange';
import Loader from '../Loader/Loader';
import { SuccessMessage, ErrorMessage } from '../Messages/Messages';
import { FaCamera } from 'react-icons/fa';

const ProfilePictureEdit = () => {
  const { imageSrc, handleImageChange, isLoading, successMessage, errorMessage } = useProfilePicChange();

  return (
    <>
      {successMessage && <SuccessMessage text={successMessage} />}
      {errorMessage && <ErrorMessage text={errorMessage} />}
      {isLoading ? (
        <Loader />
      ) : (
        <div className="profile-pic">
          <img src={imageSrc} id="output" alt="Profile" />
          <label className="-label" htmlFor="file">
            <FaCamera className="icon-camera" />
          </label>
          <input id="file" type="file" onChange={handleImageChange} />
        </div>
      )}
    </>
  );
};

export default ProfilePictureEdit;