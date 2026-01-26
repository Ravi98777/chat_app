import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../apiCalls/auth";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const onFormSubmit = async (e) => {
    e.preventDefault(); // ✅ must stop page refresh

    try {
      dispatch(showLoader());

      const response = await loginUser({
        email: user.email.trim().toLowerCase(),
        password: user.password,
      });

      dispatch(hideLoader());

      console.log("LOGIN RESPONSE:", response);

      if (response?.success) {
        localStorage.setItem("token", response.token);
        toast.success(response.message || "Login successful");
        navigate("/");
      } else {
        toast.error(response?.message || "Login failed");
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error?.response?.data?.message || error.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>

      <div className="card">
        <div className="card_title">
          <h1>Login Here</h1>
        </div>

        <div className="form">
          {/* ✅ important */}
          <form onSubmit={onFormSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />

            {/* ✅ important */}
            <button type="submit">Login</button>
          </form>
        </div>

        <div className="card_terms">
          <span>
            Don't have an account yet? <Link to="/signup">Signup Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
