const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const sendOTP = require("../utils/sendOTP");

// 1. Registration Flow [cite: 3]
// Update ONLY the register function inside authController.js
exports.register = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Backend validation for 10 digits [cite: 37]
    if (!phone || phone.length !== 10) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // ... rest of your existing register logic remains identical

    const otp = otpGenerator.generate(6, { // [cite: 5]
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false
    });

    await User.create({
      name,
      email,
      phone,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, // [cite: 5]
    });

    await sendOTP(email, otp); // [cite: 6]
    res.json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ message: "Registration error", error });
  }
};

// Verify OTP for Registration [cite: 7]
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) { // [cite: 33]
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true; // [cite: 8]
    await user.save();
    res.json({ message: "OTP Verified" });
  } catch (error) {
    res.status(500).json({ message: "Verification error", error });
  }
};

// Set Password [cite: 8, 27]
exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt); // [cite: 32]
    
    await user.save();
    res.json({ message: "Password Set Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error setting password", error });
  }
};

// Login Flow - Email + Password [cite: 9]
exports.loginPassword = async (req, res) => {
  try {
    const { email, password } = req.body; // [cite: 10]
    const user = await User.findOne({ email }); // [cite: 11]

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password); // [cite: 12]
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" }); // [cite: 13]
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};

// Login Flow - OTP [cite: 14, 19, 29]
exports.loginOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const query = email ? { email } : { phone }; // [cite: 15, 20]
    const user = await User.findOne(query);

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false
    });

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    if (email) {
      await sendOTP(email, otp); // [cite: 21]
    } else {
      console.log(`SMS OTP to ${phone}: ${otp}`); // [cite: 16]
    }

    res.json({ message: "OTP sent" });
  } catch (error) {
    res.status(500).json({ message: "OTP error", error });
  }
};

// Verify Login OTP [cite: 30]
exports.verifyLoginOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body; // [cite: 17, 22]
    const query = email ? { email } : { phone };
    const user = await User.findOne(query);

    if (user.otp !== otp || user.otpExpiry < Date.now()) { // [cite: 33]
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" }); // [cite: 18, 23]
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Verification error", error });
  }
};