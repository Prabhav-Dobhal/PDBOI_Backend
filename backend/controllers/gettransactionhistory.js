const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.getTransactionHistory = async (req, res) => {
  const token = req.body.headers.Authorization; // Extract token
  const { page = 1, limit = 15 } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ userID: decoded.userID });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const startIndex = (page - 1) * limit;
    const transactionHistory = user.TransactionHistory.reverse().slice(
      startIndex,
      startIndex + limit
    );

    res.status(200).json({ transactions: transactionHistory });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    res.status(500).json({ message: "Server error" });
  }
};
