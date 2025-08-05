import "./ProfilePicture.css";
import useApiFetch from "../../hooks/useApiFetch";

const ProfilePicture = () => {
  const { responseData } = useApiFetch("/users", "GET");

  const profilePicture = responseData?.profilePicture || "/assets/default-profile.png";

  return (
    <img src={profilePicture} alt="Profile Picture" className="profile-picture" />
  );
};

export default ProfilePicture;