const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONN_STRING);
    console.log("DB Connection Successful!");
  } catch (error) {
    console.log("DB Connection Failed:", error.message);
  }
};

module.exports = connectDB;
