import "./ProfilePicture.css";
import useApiFetch from "../../hooks/useApiFetch";

const ProfilePicture = () => {
  const { responseData } = useApiFetch("/users", "GET");

  const profilePicture = responseData?.profilePicture || "/assets/default-profile.png";
  const isDefault = !responseData?.profilePicture;

  return (
    <img
      src={profilePicture}
      alt="Profile Picture"
      className={`profile-picture${isDefault ? ' default-avatar' : ''}`}
    />
  );
};

export default ProfilePicture;