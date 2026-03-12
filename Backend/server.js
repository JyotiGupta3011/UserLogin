const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const limiter = require("./middleware/rateLimit"); 

dotenv.config();
const app = express();

// 1. TRUST PROXY (Required for Render + Rate Limiting)
app.set('trust proxy', 1);

// 2. MIDDLEWARE
app.use(express.json());

// 3. CORRECT CORS (Handles both Vercel and Localhost)
const allowedOrigins = [
  'https://user-login-tawny.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS blocked by server'), false);
    }
  },
  credentials: true
}));

// 4. RATE LIMITING
app.use("/api", limiter); 

// 5. ROUTES
app.use("/api", authRoutes);

// 6. START SERVER
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Database connection failed:", err);
});