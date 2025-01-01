const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.verifytransaction = async (req, res) => {
  const { userID, amount } = req.body; // User ID and amount from request body
  const token = req.body.headers.Authorization; // Extract token

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  try {
    // Verify the token to extract the sender's userID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const senderUserID = decoded.userID; // Extract sender's userID from decoded token

    // Find the sender and recipient users in the database
    const sender = await User.findOne({ userID: senderUserID });
    const recipient = await User.findOne({ userID });

    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (sender.userID === recipient.userID) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Validate that the amount is a positive number
    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Transfer amount must be a positive number" });
    }

    // Check if sender has enough balance
    if (sender.Balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Respond with a success message
    res.status(200).json({ Recipient: recipient.Name });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
