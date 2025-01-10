const User = require('../models/userModel');

async function DeleteUser(req, res) {
  const { id } = req.params;

  try {
    // Find and delete the user by their ID
    const result = await User.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    });
  }
}

module.exports = DeleteUser;
