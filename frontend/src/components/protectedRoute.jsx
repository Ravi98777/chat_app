import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser, getAllUsers } from "./../apiCalls/users";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import toast from "react-hot-toast";
import { setAllUsers, setUser, setAllChats } from "../redux/usersSlice";
import { getAllChats } from "../apiCalls/chat";

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      dispatch(showLoader());

      // ✅ MUST succeed
      const loggedUserRes = await getLoggedUser();
      if (!loggedUserRes?.success) {
        dispatch(hideLoader());
        localStorage.removeItem("token");
        toast.error(loggedUserRes?.message || "Session expired. Login again.");
        navigate("/login");
        return;
      }
      dispatch(setUser(loggedUserRes.data));

      // ✅ Optional (don’t logout if fails)
      const usersRes = await getAllUsers();
      if (usersRes?.success) {
        dispatch(setAllUsers(usersRes.data));
      }

      const chatsRes = await getAllChats();
      if (chatsRes?.success) {
        dispatch(setAllChats(chatsRes.data));
      }

      dispatch(hideLoader());
    } catch (error) {
      dispatch(hideLoader());
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return <>{children}</>;
}

export default ProtectedRoute;
