const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Assuming you have a User model defined

// Function to generate the User ID
function generateUserId(name) {
  // Extract the first name (before the space)
  const firstName = name.split(" ")[0]; // Splits the name and gets the first part before space

  // Generate a random 3-digit number
  const randomId = Math.floor(100 + Math.random() * 900); // Random 3-digit number between 100 and 999

  // Combine the first name and random 3-digit ID
  const generatedUserId = `${firstName}${randomId}`;

  return generatedUserId;
}

exports.signup = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  // Basic validation: Ensure required fields are provided
  if (!name || !email || !phoneNumber || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  // Check if the user already exists in the database
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists with that email" });
  }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // salt rounds

    let generatedUserId = generateUserId(name);

    // Check if generated userId already exists, and regenerate if it does
    let userExists = await User.findOne({ userID: generatedUserId });
    while (userExists) {
      generatedUserId = generateUserId(name); // Regenerate the userId
      userExists = await User.findOne({ userID: generatedUserId });
    }

    // Create a new user object
    const newUser = new User({
      userID: generatedUserId,
      Name: name,
      EmailID: email,
      phoneNumber,
      password: hashedPassword, // store hashed password
      Balance: 0,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with the userId (or any other data you want to return)
    res
      .status(201)
      .json({ userId: generatedUserId, message: "User created successfully!" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Server error" });
  }
};
