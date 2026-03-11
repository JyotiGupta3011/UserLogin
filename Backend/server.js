const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const limiter = require("./middleware/rateLimit"); // Import your rate limiter

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Apply Rate Limiting to all auth routes 
app.use("/api", limiter); 

// Routes
app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});