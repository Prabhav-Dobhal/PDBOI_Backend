const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.getuserinfo = async (req, res) => {
  const token = req.body.headers.Authorization; // Extract token

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userID } = decoded;

    const user = await User.findOne({ userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.Name,
      balance: user.Balance,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
