const User = require("../models/userModel");

async function allUsers(req,res){
  try {
    const users = await User.find()
    // console.log("Users data fetched from the database:", users);
    res.status(200).json({success:true, users})
  } catch (error) {
    console.log(error)
    res.status(500).json({success: false, message:"Failed to fetch users"})
  }
}
module.exports = allUsers