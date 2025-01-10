const User = require("../models/userModel"); // Import your User model

async function userDetailsController(req, res) {
  try {
    const userId = req.user.id; // Extract user ID from the req.user object
    // console.log("User ID from token:", userId); 

    // Find user in the database using the ID
    const user = await User.findById(userId).select("-password"); // Exclude password for security reasons

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // console.log("User data fetched from the database:", user);

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user details" });
  }
}

module.exports = userDetailsController;
