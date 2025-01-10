/**
 * Controller for logging out the user by clearing the authentication cookie.
 */

const userLogoutController = (req, res) => {
    try {
      // Clear the cookie that stores the authentication token
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        sameSite: "Strict", // Protects against CSRF
      });
  
      // Send a response indicating logout was successful
      res.status(200).json({
        message: "Logout successful.",
        error: false,
        success: true,
      });
    } catch (error) {
      // Handle errors and send a response
      res.status(500).json({
        message: error.message || "An error occurred during logout.",
        error: true,
        success: false,
      });
    }
  };
  
  module.exports = userLogoutController;
  