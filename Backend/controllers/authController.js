const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const sendOTP = require("../utils/sendOTP");

exports.register = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email or phone" });
    }

    const otp = otpGenerator.generate(6, { 
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false
    });

    await User.create({
      name,
      email,
      phone,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, 
    });

    // --- FAIL-SAFE OTP SENDING ---
    try {
      await sendOTP(email, otp); 
    } catch (err) {
      console.log("⚠️ Email Service not configured. Manual OTP Check:");
      console.log(`🔑 REGISTRATION OTP FOR ${email}: ${otp}`);
    }

    res.json({ message: "OTP sent! Check your email or server logs." });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Registration error", error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true; 
    await user.save();
    res.json({ message: "OTP Verified" });
  } catch (error) {
    res.status(500).json({ message: "Verification error", error: error.message });
  }
};

exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    res.json({ message: "Password Set Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error setting password", error: error.message });
  }
};

exports.loginPassword = async (req, res) => {
  try {
    const { email, password } = req.body; 
    const user = await User.findOne({ email }); 

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.password) return res.status(400).json({ message: "Password not set for this account" });

    const match = await bcrypt.compare(password, user.password); 
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
};

exports.loginOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const query = email ? { email } : { phone };
    const user = await User.findOne(query);

    if (!user) return res.status(404).json({ message: "Account not found. Please register first." });

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false
    });

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    // --- FAIL-SAFE OTP SENDING ---
    if (email) {
      try {
        await sendOTP(email, otp);
      } catch (err) {
        console.log(`🔑 DEBUG OTP FOR EMAIL ${email}: ${otp}`);
      }
    } else {
      console.log(`🔑 DEBUG SMS OTP FOR PHONE ${phone}: ${otp}`);
    }

    res.json({ message: "OTP sent! Check logs/email." });
  } catch (error) {
    res.status(500).json({ message: "OTP error", error: error.message });
  }
};

exports.verifyLoginOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    const query = email ? { email } : { phone };
    const user = await User.findOne(query);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Verification error", error: error.message });
  }
};