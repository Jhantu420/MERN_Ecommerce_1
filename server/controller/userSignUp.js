const User = require("../models/userModel");
const bcrypt = require("bcrypt");
async function userSignUpController(req, res) {
  try {
    const { email, password, name } = req.body;

    // Validate inputs
    if (!email) {
      throw new Error("Please provide an email.");
    }
    if (!password) {
      throw new Error("Please provide a password.");
    }
    if (!name) {
      throw new Error("Please provide a name.");
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already in use.",
        error: true,
        success: false,
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user instance
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    res.status(201).json({
      message: "User signed up successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    // Handle errors and send a response
    res.status(500).json({
      message: error.message || "An error occurred during sign-up.",
      error: true,
      success: false,
    });
  }
}

module.exports = userSignUpController;