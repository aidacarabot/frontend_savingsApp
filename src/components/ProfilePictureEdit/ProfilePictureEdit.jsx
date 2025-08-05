import './ProfilePictureEdit.css';
import useProfilePicChange from '../../hooks/useProfilePicChange';
import Loader from '../Loader/Loader';
import { FaCamera } from 'react-icons/fa';

const ProfilePictureEdit = () => {
  const { imageSrc, handleImageChange, isLoading } = useProfilePicChange();

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="profile-pic">
          <img src={imageSrc} id="output" alt="Profile" />
          <label className="-label" htmlFor="file">
            <span className="icon-camera"><FaCamera /></span>
            <span>Change Image</span>
          </label>
          <input id="file" type="file" onChange={handleImageChange} />
        </div>
      )}
    </>
  );
};

export default ProfilePictureEdit;