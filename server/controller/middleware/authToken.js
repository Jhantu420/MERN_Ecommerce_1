const jwt = require("jsonwebtoken");

async function authToken(req, res, next) {
  try {
     const token = req.cookies?.authToken

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized access. Please login." });
    }
// console.log(token);
    // Remove "Bearer " prefix if token is in the Authorization header
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    // Verify the token
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET); // Replace with your JWT secret key
    // console.log("Decoded token:", decoded);

    // Add the user data to the request object for access in controllers
    req.user = decoded;

    next(); // Pass control to the next middleware/controller
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
}

module.exports = authToken;





// const jwt = require("jsonwebtoken");

// const authToken = (req, res, next) => {
//   // Try to get the token from the 'Authorization' header (Bearer token)
//   let token = req.header("Authorization")?.split(" ")[1]; // Extract token from "Bearer <token>"

//   // If token is not in the Authorization header, check the cookies
//   if (!token && req.cookies?.authToken) {
//     token = req.cookies.token; // Get the token from cookies if present
//     console.log("Token found in cookies:", token);
//   } else if (!token) {
//     console.log(
//       "No token found in request (neither in Authorization header nor cookies)"
//     );
//     return res
//       .status(401)
//       .json({ success: false, message: "No token provided." });
//   }

//   try {
//     // Verify token using JWT secret
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded Token:", decoded); // Log the decoded token
//     req.user = decoded; // Attach the decoded user to req.user
//     next(); // Proceed to the next middleware or route handler
//   } catch (err) {
//     console.log("Invalid or expired token:", err.message); // Log any errors
//     res
//       .status(401)
//       .json({ success: false, message: "Invalid or expired token." });
//   }
// };

// module.exports = authToken;
