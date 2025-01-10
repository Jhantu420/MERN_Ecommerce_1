const User = require('../models/userModel');

async function EditUser(req, res) {
  try {
    const { id } = req.params; // Get user ID from the request parameters
    const { name, email, role } = req.body; // Destructure the updated fields from the request body

    // Validate input data
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and Email are required" });
    }

    // Find the user by ID and update their details
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
}

module.exports = EditUser;
