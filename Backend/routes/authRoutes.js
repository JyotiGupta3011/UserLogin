const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/register", auth.register);
router.post("/verify-otp", auth.verifyOTP);
router.post("/set-password", auth.setPassword);
router.post("/login-password", auth.loginPassword);
router.post("/login-otp", auth.loginOTP);
router.post("/verify-login-otp", auth.verifyLoginOTP);

module.exports = router;