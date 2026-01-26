const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Chat = require("./../models/chat");
const Message = require("./../models/message");

// ✅ Create new chat
router.post("/create-new-chat", authMiddleware, async (req, res) => {
  try {
    const members = req.body.members;

    // ✅ check if chat already exists between these two users
    const existingChat = await Chat.findOne({
      members: { $all: members },
    }).populate("members");

    if (existingChat) {
      return res.send({
        message: "Chat already exists",
        success: true,
        data: existingChat,
      });
    }

    // ✅ if not exists then create new
    const savedChat = await Chat.create({ members });
    // const savedChat = await chat.save();
    await savedChat.populate("members");

    res.status(200).send({
      message: "Chat created successfully",
      success: true,
      data: savedChat,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});





// ✅ Get all chats of logged in user
router.get("/get-all-chats", authMiddleware, async (req, res) => {
  try {
    const allChats = await Chat.find({ members: { $in: [req.userId] } })
      .populate("members")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).send({
      message: "Chat fetched successfully",
      success: true,
      data: allChats,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

// ✅ Clear unread message count
router.post("/clear-unread-message", authMiddleware, async (req, res) => {
  try {
    const chatId = req.body.chatId;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.send({
        message: "No Chat found with given chat ID.",
        success: false,
      });
    }

    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { unreadMessageCount: 0 },
      { new: true }
    )
      .populate("members")
      .populate("lastMessage");

    await Message.updateMany({ chatId: chatId, read: false }, { read: true });

    res.send({
      message: "Unread message cleared successfully",
      success: true,
      data: updatedChat,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
