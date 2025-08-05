import './ProfilePictureEdit.css';
import useProfilePicChange from '../../hooks/useProfilePicChange';
import Loader from '../Loader/Loader'; // Importar el componente Loader

const ProfilePictureEdit = () => {
  const { imageSrc, handleImageChange, isLoading } = useProfilePicChange();

  return (
    <>
      {isLoading ? ( // Mostrar solo el loader mientras se carga la imagen
        <Loader />
      ) : (
        <div className="profile-pic">
          <img src={imageSrc} id="output" alt="Profile" />
          <label className="-label" htmlFor="file">
            <span className="glyphicon glyphicon-camera"></span> //! poner icono de camara
            <span>Change Image</span>
          </label>
          <input id="file" type="file" onChange={handleImageChange} />
        </div>
      )}
    </>
  );
};

export default ProfilePictureEdit;