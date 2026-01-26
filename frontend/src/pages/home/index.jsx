 
// export default Home;
import { useSelector } from "react-redux";
import ChatArea from "./components/chat";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("https://backend-chat-app-xv55.onrender.com", {
  transports: ["websocket"],
});

function Home() {
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  const [onlineUser, setOnlineUser] = useState([]);

  useEffect(() => {
    if (!user?._id) return;

    socket.emit("join-room", user._id);
    socket.emit("user-login", user._id);

    const handleOnlineUsers = (onlineusers) => {
      setOnlineUser(onlineusers);
    };

    socket.on("online-users", handleOnlineUsers);
    socket.on("online-users-updated", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
      socket.off("online-users-updated", handleOnlineUsers);
    };
  }, [user]);

  return (
    <div className="home-page">
      <Header socket={socket} />
      <div className="main-content responsive-layout">
        {/* ✅ Mobile view: if chat selected, hide sidebar */}
        <div className={`sidebar-wrap ${selectedChat ? "hide-on-mobile" : ""}`}>
          <Sidebar socket={socket} onlineUser={onlineUser} />
        </div>

        {/* ✅ Mobile view: show chat only when selected */}
        <div className={`chat-wrap ${!selectedChat ? "hide-on-mobile" : ""}`}>
          {selectedChat && <ChatArea socket={socket} />}
        </div>
      </div>
    </div>
  );
}

export default Home;
