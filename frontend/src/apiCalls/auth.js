import { axiosInstance, url } from "./index";

export const signupUser = async (user) => {
  try {
    const response = await axiosInstance.post(`${url}/api/auth/signup`, user);
    return response.data;
  } catch (error) {
    return error?.response?.data || { success: false, message: "Signup failed" };
  }
};


export const loginUser = async (user) => {
  try {
    const res = await axiosInstance.post("/api/auth/login", user);
    return res.data;
  } catch (err) {
    return err?.response?.data || { success: false, message: "Login failed" };
  }
};
