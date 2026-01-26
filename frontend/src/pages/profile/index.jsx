import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadProfilePic } from "../../apiCalls/users";
import { hideLoader, showLoader } from "../../redux/loaderSlice";
import toast from "react-hot-toast";
import { setUser } from "../../redux/usersSlice";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user } = useSelector((state) => state.userReducer);
  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.profilePic) {
      setImage(user.profilePic);
    }
  }, [user]);

  function getInitials() {
    if (!user?.firstname || !user?.lastname) return "U";
    let f = user.firstname.toUpperCase()[0];
    let l = user.lastname.toUpperCase()[0];
    return f + l;
  }

  function getFullname() {
    if (!user?.firstname || !user?.lastname) return "User";
    let fname =
      user.firstname.at(0).toUpperCase() +
      user.firstname.slice(1).toLowerCase();
    let lname =
      user.lastname.at(0).toUpperCase() +
      user.lastname.slice(1).toLowerCase();
    return fname + " " + lname;
  }

  const onFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const updateProfilePic = async () => {
    try {
      if (!image) return toast.error("Please select an image");

      dispatch(showLoader());
      const response = await uploadProfilePic(image);
      dispatch(hideLoader());

      if (response?.success) {
        toast.success(response.message);
        dispatch(setUser(response.data));

        // ✅ Navigate to home after update
        navigate("/");
      } else {
        toast.error(response?.message || "Upload failed");
      }
    } catch (err) {
      dispatch(hideLoader());
      toast.error(err?.message || "Upload error");
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-pic-container">
        {image ? (
          <img
            src={image}
            alt="Profile Pic"
            className="user-profile-pic-upload"
          />
        ) : (
          <div className="user-default-profile-avatar">{getInitials()}</div>
        )}
      </div>

      <div className="profile-info-container">
        <div className="user-profile-name">
          <h1>{getFullname()}</h1>
        </div>

        <div>
          <b>Email: </b> {user?.email}
        </div>

        <div>
          <b>Account Created: </b>
          {moment(user?.createdAt).format("MMM DD, YYYY")}
        </div>

        <div className="select-profile-pic-container">
          <input type="file" accept="image/*" onChange={onFileSelect} />
          <button className="upload-image-btn" onClick={updateProfilePic}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
