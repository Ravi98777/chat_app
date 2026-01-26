require("dotenv").config({ path: "./config.env" });

const server = require("./app");
const connectDB = require("./config/dbConfig");

connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Listening to requests on PORT: ${PORT}`);
});
