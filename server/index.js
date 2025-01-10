const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("../server/config/db");
const router = require('./routes');
const cookieParser = require("cookie-parser");

// Cookies are a storage mechanism, while tokens are the authentication credentials. A cookie can be used to store a token for convenience and automatic handling by the browser.


const app = express();
app.use(express.json()); // Parse incoming JSON requests
// Middleware
app.use(cookieParser()); // This will parse cookies and populate req.cookies
// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Frontend origin
  credentials: true, // Allow cookies
};
app.use(cors(corsOptions));

app.use("/api", router); // Use leading slash in path

app.get("/api/protected", (req, res) => {
  console.log("Cookies received:", req.cookies); // Should include 'authToken'
  res.json({ message: "Cookies checked" });
});

// Port assignment
const PORT = process.env.PORT || 8050;

// Connect to the database and start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}).catch((error) => {
  console.error("Failed to connect to the database:", error.message);
});
