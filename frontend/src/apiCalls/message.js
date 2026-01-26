import { axiosInstance ,url} from "./index";

export const createNewMessage = async (message) => {
  try {
    const response = await axiosInstance.post(url+"/api/message/new-message", message);
    return response.data;
  } catch (error) {
    return error?.response?.data || { success: false, message: "Message send failed" };
  }
};

export const getAllMessages = async (chatId) => {
  try {
    const response = await axiosInstance.get(url+`/api/message/get-all-messages/${chatId}`);
    return response.data;
  } catch (error) {
    return error?.response?.data || { success: false, message: "Messages fetch failed" };
  }
};
