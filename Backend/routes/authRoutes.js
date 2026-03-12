const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

// --- Registration Flow ---
// Step 1: Initial Signup (Sends OTP)
router.post("/register", auth.register);

// Step 2: Verify the OTP sent during registration
router.post("/verify-otp", auth.verifyOTP);

// Step 3: Finalize account with a password
router.post("/set-password", auth.setPassword);


// --- Login Flow ---
// Option A: Standard Email + Password Login
router.post("/login-password", auth.loginPassword);

// Option B: Request OTP for Passwordless Login (Email or Phone)
router.post("/login-otp", auth.loginOTP);

// Step 2 for Option B: Verify the Login OTP
router.post("/verify-login-otp", auth.verifyLoginOTP);

module.exports = router;