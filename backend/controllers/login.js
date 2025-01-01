const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Login function
exports.login = async (req, res) => {
  const { userId, password } = req.body;

  try {
    // Find the user by userId (assuming userId is unique)
    const user = await User.findOne({ userID: userId });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userID: user.userID }, // Include userId in the payload
      process.env.JWT_SECRET, // Your secret key from .env
      { expiresIn: "1h" } // Token expiration time
    );

    // Send the token to the client
    return res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
