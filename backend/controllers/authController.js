const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./../models/user");

router.post("/signup", async (req, res) => {
  try {
    const email = req.body.email?.trim();

    const user = await User.findOne({ email });
    if (user) {
      return res.send({
        message: "User already exists.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

     User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email,
      password: hashedPassword,
    });


    res.status(201).send({
      message: "User created successfully!",
      success: true,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

//login backend code 

router.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.trim();
    console.log("EMAIL RECEIVED:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        message: "User does not exist",
        success: false,
      });
    }

    const isvalid = await bcrypt.compare(req.body.password, user.password);
    if (!isvalid) {
      return res.send({
        message: "invalid password",
        success: false,
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "3d" }
    );

    res.send({
      message: "user logged-in successfully",
      success: true,
      token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
