const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).send({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId; // ✅ important

    next();
  } catch (error) {
    return res.status(401).send({ success: false, message: "Invalid token" });
  }
};
