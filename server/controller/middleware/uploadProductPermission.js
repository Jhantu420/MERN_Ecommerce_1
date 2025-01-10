

const User = require("../../models/userModel"); // Make sure this path is correct

const uploadProductPermission = async (req, res, next) => {
  try {
    // Get the userId from the token (it's stored in req.user from the previous middleware)
    const userId = String(req.user.id); // Assuming req.user contains the decoded token with the 'id'

    // Fetch user from the database by userId
    const userDetails = await User.findById(userId);

    // Check if the user exists
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found in uploadProductPermission middleware",
      });
    }

    // Log the user's role for debugging
    // console.log("User Role:", userDetails.role);

    // Check if the user is an admin
    if (userDetails.role === "admin") {
      // console.log("Access granted: Admin user");
      next(); // Proceed to the next middleware or route handler
    } else {
      // console.log("Access denied: Not an admin");
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Only admins can perform this action.",
      });
    }
  } catch (error) {
    console.error("Error in uploadProductPermission:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = uploadProductPermission;
