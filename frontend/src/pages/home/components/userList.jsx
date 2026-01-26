import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createNewChat } from "./../../../apiCalls/chat";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "./../../../redux/usersSlice";
import moment from "moment";
import { useEffect } from "react";
import store from "../../../redux/store";

function UsersList({ searchKey, socket, onlineUser }) {
  const { allUsers, allChats, user: currentUser, selectedChat } = useSelector(
    (state) => state.userReducer
  );
  const dispatch = useDispatch();

  const startNewChat = async (searchedUserId) => {
    let response = null;

    try {
      dispatch(showLoader());
      response = await createNewChat([currentUser._id, searchedUserId]);
      dispatch(hideLoader());

      if (response?.success) {
        toast.success(response.message);

        const newChat = response.data;

        // ✅ prevent duplicate chats in redux
        const alreadyExists = allChats.some((c) => c._id === newChat._id);
        const updatedChats = alreadyExists ? allChats : [newChat, ...allChats];

        dispatch(setAllChats(updatedChats));
        dispatch(setSelectedChat(newChat));
      } else {
        toast.error(response?.message || "Failed to create chat");
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const openChat = async (selectedUserId) => {
    const chat = allChats.find(
      (chat) =>
        chat.members.map((m) => m._id).includes(currentUser._id) &&
        chat.members.map((m) => m._id).includes(selectedUserId)
    );

    if (chat) {
      dispatch(setSelectedChat(chat));
    } else {
      await startNewChat(selectedUserId);
    }
  };

  const IsSelectedChat = (user) => {
    if (selectedChat) {
      return selectedChat.members.map((m) => m._id).includes(user._id);
    }
    return false;
  };

  const getLastMessageTimeStamp = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId)
    );

    if (!chat || !chat?.lastMessage) return "";
    return moment(chat?.lastMessage?.createdAt).format("hh:mm A");
  };

  const getlastMessage = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId)
    );

    if (!chat || !chat.lastMessage) return "";

    const msgPrefix =
      chat?.lastMessage?.sender === currentUser._id ? "You: " : "";
    return msgPrefix + (chat?.lastMessage?.text || "").substring(0, 25);
  };

  function formatName(user) {
    let fname =
      user.firstname?.at(0)?.toUpperCase() +
      user.firstname?.slice(1)?.toLowerCase();
    let lname =
      user.lastname?.at(0)?.toUpperCase() +
      user.lastname?.slice(1)?.toLowerCase();
    return fname + " " + lname;
  }

  useEffect(() => {
    socket.off("set-message-count").on("set-message-count", (message) => {
      const selectedChat = store.getState().userReducer.selectedChat;
      let allChats = store.getState().userReducer.allChats;

      if (selectedChat?._id !== message.chatId) {
        const updatedchats = allChats.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              unreadMessageCount: (chat?.unreadMessageCount || 0) + 1,
              lastMessage: message,
            };
          }
          return chat;
        });
        allChats = updatedchats;
      }

      const latestChat = allChats.find((chat) => chat._id === message.chatId);
      const otherChats = allChats.filter((chat) => chat._id !== message.chatId);

      allChats = [latestChat, ...otherChats].filter(Boolean);

      dispatch(setAllChats(allChats));
    });
  }, []);

  const getUnreadMessageCount = (userId) => {
    const chat = allChats.find((chat) =>
      chat.members.map((m) => m._id).includes(userId)
    );

    if (
      chat &&
      chat.unreadMessageCount &&
      chat.lastMessage?.sender !== currentUser._id
    ) {
      return (
        <div className="unread-message-counter">
          +{Number(chat.unreadMessageCount) || 0}
        </div>
      );
    }
    return "";
  };

function getData() {
  // ✅ Search mode -> filter from allUsers
  if (searchKey && searchKey.trim() !== "") {
    return allUsers.filter((u) => {
      return (
        u.firstname?.toLowerCase().includes(searchKey.toLowerCase()) ||
        u.lastname?.toLowerCase().includes(searchKey.toLowerCase())
      );
    });
  }

  // ✅ Default -> show allUsers always
  return allUsers;
}


  // ✅ REMOVE DUPLICATE USERS (VERY IMPORTANT FIX)
  const data = getData() || [];
  const seen = new Set();
  const uniqueData = [];

  data.forEach((obj) => {
    let u = obj;
    if (obj.members) {
      u = obj.members.find((m) => m._id !== currentUser._id);
    }
    if (u && !seen.has(u._id)) {
      seen.add(u._id);
      uniqueData.push(obj);
    }
  });

  return uniqueData.map((obj) => {
    let user = obj;

    if (obj.members) {
      user = obj.members.find((mem) => mem._id !== currentUser._id);
    }

    if (!user) return null;

    return (
      <div
        className="user-search-filter"
        onClick={() => openChat(user._id)}
        key={user._id}
      >
        <div className={IsSelectedChat(user) ? "selected-user" : "filtered-user"}>
          <div className="filter-user-display">
            {user.profilePic && (
              <img
                src={user.profilePic}
                alt="Profile Pic"
                className="user-profile-image"
                style={
                  onlineUser.includes(user._id)
                    ? { border: "#82e0aa 3px solid" }
                    : {}
                }
              />
            )}

            {!user.profilePic && (
              <div
                className={
                  IsSelectedChat(user)
                    ? "user-selected-avatar"
                    : "user-default-avatar"
                }
                style={
                  onlineUser.includes(user._id)
                    ? { border: "#82e0aa 3px solid" }
                    : {}
                }
              >
                {user.firstname?.charAt(0)?.toUpperCase() +
                  user.lastname?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <div className="filter-user-details">
              <div className="user-display-name">{formatName(user)}</div>
              <div className="user-display-email">
                {getlastMessage(user._id) || user.email}
              </div>
            </div>

            <div>
              {getUnreadMessageCount(user._id)}
              <div className="last-message-timestamp">
                {getLastMessageTimeStamp(user._id)}
              </div>
            </div>

            {!allChats.find((chat) =>
              chat.members.map((m) => m._id).includes(user._id)
            ) && (
              <div className="user-start-chat">
                <button
                  className="user-start-chat-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    startNewChat(user._id);
                  }}
                >
                  Start Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });
}

export default UsersList;
