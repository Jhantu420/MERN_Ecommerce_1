const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function userLoginController(req, res) {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email) {
      throw new Error("Please provide an email.");
    }
    if (!password) {
      throw new Error("Please provide a password.");
    }

    // Check if the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found. Please sign up first.",
        error: true,
        success: false,
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
        error: true,
        success: false,
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email },
      process.env.JWT_SECRET, // Ensure to set JWT_SECRET in your environment variables
      { expiresIn: "1h" }
    );

    // Set the token in a cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Prevent JavaScript access (protects against XSS)
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "Strict", // Protects against CSRF
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    });
    
    // Respond with success and token
    res.status(200).json({
      message: "Login successful.",
      error: false,
      success: true,
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
      },
    });
  } catch (error) {
    // Handle errors and send a response
    res.status(500).json({
      message: error.message || "An error occurred during login.",
      error: true,
      success: false,
    });
  }
}

module.exports = userLoginController;
