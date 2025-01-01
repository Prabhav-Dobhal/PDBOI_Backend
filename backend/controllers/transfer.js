const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.transfer = async (req, res) => {
  let { amount, recipientID } = req.body;
  const token = req.body.headers.Authorization; // Extract token

  amount = Number(amount);

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sender = await User.findOne({ userID: decoded.userID });
    const recipient = await User.findOne({ userID: recipientID });

    if (!sender || !recipient) {
      return res.status(404).json({ message: "Sender or recipient not found" });
    }

    if (sender.Balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Proceed with the transaction: deduct amount from sender and add it to recipient
    sender.Balance -= amount;
    recipient.Balance += amount;

    // Add transaction history for sender
    sender.TransactionHistory.push({
      recipient: recipient.Name,
      amount: -amount, // Negative for sender
      date: new Date(),
    });

    // Add transaction history for recipient
    recipient.TransactionHistory.push({
      recipient: sender.Name,
      amount: amount, // Positive for recipient
      date: new Date(),
    });

    await sender.save();
    await recipient.save();

    res
      .status(200)
      .json({ message: "Transfer successful", recipient: recipient.Name });
  } catch (error) {
    console.error("Error during transaction:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
