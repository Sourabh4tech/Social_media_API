//created a Server
const express = require("express");
const app = express();
const errorHandler = require("./middleware/errorHandler");
//middleware
app.use(express.json());
app.use(errorHandler);
require("dotenv").config();

//importing routes files
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const friendRoutes = require("./routes/friendRoutes");
const { verifyToken } = require("./middleware/authMiddleware");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", verifyToken, postRoutes);
app.use("/api/friends", verifyToken, friendRoutes);

//Db connection
const dbConnect = require("./config/database");
dbConnect();

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
