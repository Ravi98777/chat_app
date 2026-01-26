const router = require("express").Router();
const User = require("./../models/user");
const authMiddleware = require("./../middlewares/authMiddleware");
const cloudinary = require("./../cloudinary");


//  GET Details of current logged-in user
router.get("/get-logged-user", authMiddleware, async (req, res) => {
  try {
    //  req.userId comes from authMiddleware
    const user = await User.findById(req.userId).select("-password");

    res.send({
      message: "user fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

//  GET All users except current user
router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.userId } }).select(
      "-password"
    );

    res.send({
      message: "All users fetched successfully",
      success: true,
      data: allUsers,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      success: false,
    });
  }
});

// ✅ Upload profile pic
router.post("/upload-profile-pic", authMiddleware, async (req, res) => {
  try {
    const image = req.body.image;

    if (!image) {
      return res.send({
        success: false,
        message: "No image provided",
      });
    }

    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "chat-app/images",
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { profilePic: uploadedImage.secure_url },
      { new: true }
    ).select("-password");

    res.send({
      message: "Profile picture uploaded successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.send({
      message: error.message,
      success: false,
    });
  }
});


module.exports = router;
