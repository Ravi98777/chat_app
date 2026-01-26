import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { clearUnreadMessageCount } from "../../../apiCalls/chat";
import moment from "moment";
import { setAllChats, setSelectedChat } from "../../../redux/usersSlice";
import EmojiPicker from "emoji-picker-react";

function ChatArea({ socket }) {
  const dispatch = useDispatch();
  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer
  );

  const selectedUser = selectedChat?.members?.find((u) => u._id !== user._id);

  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const formatTime = (timestamp) => {
    const now = moment();
    const diff = now.diff(moment(timestamp), "days");

    if (diff < 1) return `Today ${moment(timestamp).format("hh:mm A")}`;
    if (diff === 1) return `Yesterday ${moment(timestamp).format("hh:mm A")}`;
    return moment(timestamp).format("MMM D, hh:mm A");
  };

  const getMessages = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllMessages(selectedChat._id);
      dispatch(hideLoader());

      if (response?.success) {
        setAllMessages(response.data);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error?.message || "Messages load failed");
    }
  };

  const clearUnreadMessages = async () => {
    try {
      socket.emit("clear-unread-messages", {
        chatId: selectedChat._id,
        members: selectedChat.members.map((m) => m._id),
      });

      const response = await clearUnreadMessageCount(selectedChat._id);

      if (response?.success) {
        const updatedChats = allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return { ...chat, unreadMessageCount: 0 };
          }
          return chat;
        });

        dispatch(setAllChats(updatedChats));
      }
    } catch (error) {
      toast.error(error?.message || "Clear unread failed");
    }
  };

  const sendMessage = async (image = "") => {
    try {
      if (!message.trim() && !image) return;

      const textToSend = message;
      setMessage("");
      setShowEmojiPicker(false);

      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: textToSend,
        image: image,
      };

      socket.emit("send-message", {
        ...newMessage,
        members: selectedChat.members.map((m) => m._id),
        createdAt: new Date().toISOString(),
      });

      setAllMessages((prev) => [
        ...prev,
        { ...newMessage, createdAt: new Date().toISOString(), read: false },
      ]);

      const response = await createNewMessage(newMessage);

      if (!response?.success) {
        toast.error(response?.message || "Message not saved");
      }
    } catch (error) {
      toast.error(error?.message || "Send failed");
    }
  };

  const sendImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      await sendMessage(reader.result);
    };

    e.target.value = "";
  };

  function formatName(u) {
    if (!u?.firstname || !u?.lastname) return "User";
    let fname =
      u.firstname.at(0).toUpperCase() + u.firstname.slice(1).toLowerCase();
    let lname =
      u.lastname.at(0).toUpperCase() + u.lastname.slice(1).toLowerCase();
    return fname + " " + lname;
  }

  useEffect(() => {
    if (!selectedChat?._id) return;
    getMessages();

    if (selectedChat?.lastMessage?.sender !== user._id) {
      clearUnreadMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat?._id) return;

    const handleReceiveMessage = (msg) => {
      if (msg.chatId !== selectedChat._id) return;
      if (msg.sender === user._id) return; // ✅ stop sender duplicate

      setAllMessages((prev) => [...prev, msg]);
      clearUnreadMessages();
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [selectedChat, socket]);

  useEffect(() => {
    const msgContainer = document.getElementById("main-chat-area");
    if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
  }, [allMessages, isTyping]);

  return (
    <>
      {selectedChat && (
        <div className="app-chat-area">
          {/* ✅ Header with Mobile Back Button */}
          <div className="app-chat-area-header">
            <button
              className="mobile-back-btn"
              onClick={() => dispatch(setSelectedChat(null))}
            >
              ← Back
            </button>
            {formatName(selectedUser)}
          </div>

          <div className="main-chat-area" id="main-chat-area">
            {allMessages.map((msg, index) => {
              const isCurrentUserSender = msg.sender === user._id;

              return (
                <div
                  key={msg._id || index}
                  className="message-container"
                  style={{
                    justifyContent: isCurrentUserSender ? "end" : "start",
                  }}
                >
                  <div>
                    <div
                      className={
                        isCurrentUserSender ? "send-message" : "received-message"
                      }
                    >
                      {msg.text && <div>{msg.text}</div>}
                      {msg.image && (
                        <div>
                          <img
                            src={msg.image}
                            alt="img"
                            height="120"
                            width="120"
                          />
                        </div>
                      )}
                    </div>

                    <div
                      className="message-timestamp"
                      style={{
                        float: isCurrentUserSender ? "right" : "left",
                      }}
                    >
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {showEmojiPicker && (
            <div
              style={{
                width: "100%",
                display: "flex",
                padding: "0px 20px",
                justifyContent: "right",
              }}
            >
              <EmojiPicker
                style={{ width: "300px", height: "400px" }}
                onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)}
              />
            </div>
          )}

          <div className="send-message-div">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <label htmlFor="file">
              <i className="fa fa-picture-o send-image-btn"></i>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                accept="image/jpg,image/png,image/jpeg,image/gif"
                onChange={sendImage}
              />
            </label>

            <button
              type="button"
              className="fa fa-smile-o send-emoji-btn"
              aria-hidden="true"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            ></button>

            <button
              type="button"
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              onClick={() => sendMessage("")}
            ></button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatArea;
