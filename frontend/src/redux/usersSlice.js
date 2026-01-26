import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    allUsers: [],
    allChats: [],
    selectedChat: null,
    totalUnread: 0, // ✅ NEW
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    setAllChats: (state, action) => {
      state.allChats = action.payload;

      // ✅ NEW: auto calculate total unread
      state.totalUnread = action.payload.reduce((sum, chat) => {
        return sum + (chat?.unreadMessageCount || 0);
      }, 0);
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setTotalUnread: (state, action) => {
      state.totalUnread = action.payload;
    },
  },
});

export const {
  setUser,
  setAllUsers,
  setAllChats,
  setSelectedChat,
  setTotalUnread,
} = usersSlice.actions;

export default usersSlice.reducer;
