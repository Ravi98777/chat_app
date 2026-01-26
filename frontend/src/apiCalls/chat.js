import { axiosInstance ,url} from "./index";

export const createNewChat = async (members) => {
  try {
    const response = await axiosInstance.post(url+"/api/chat/create-new-chat", {
      members,
    });
    return response.data;
  } catch (error) {
    return error?.response?.data || { success: false, message: "Chat create failed" };
  }
};

export const getAllChats = async () => {
  try {
    const response = await axiosInstance.get(url+"/api/chat/get-all-chats");
    return response.data;
  } catch (error) {
    return error?.response?.data || { success: false, message: "Chats fetch failed" };
  }
};

export const clearUnreadMessageCount = async (chatId) => {
  try {
    const response = await axiosInstance.post(url+"/api/chat/clear-unread-message", {
      chatId,
    });
    return response.data;
  } catch (error) {
    return error?.response?.data || { success: false, message: "Clear unread failed" };
  }
};
