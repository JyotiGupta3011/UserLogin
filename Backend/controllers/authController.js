const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const sendOTP = require("../utils/sendOTP");

exports.register = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Validation
    if (!phone || phone.length !== 10) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = otpGenerator.generate(6, { 
      upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false 
    });

    await User.create({
      name, email, phone, otp,
      otpExpiry: Date.now() + 5 * 60 * 1000, 
    });

    // We AWAIT this, but the utility now has its own try/catch
    await sendOTP(email, otp); 

    res.json({ message: "OTP sent! Check your email (or server logs if email fails)" });
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
    res.status(500).json({ message: "Verification error", error });
  }
};

exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    res.json({ message: "Password Set Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error setting password", error });
  }
};

exports.loginPassword = async (req, res) => {
  try {
    const { email, password } = req.body; 
    const user = await User.findOne({ email }); 

    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password); 
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET || "temporary_secret_key", 
    { expiresIn: "1d" }
  );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};

exports.loginOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    const query = email ? { email } : { phone };
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
      // We wrap this in another try/catch so an email failure 
      // doesn't crash the whole login request
      try {
        await sendOTP(email, otp);
      } catch (emailErr) {
        console.log("⚠️ Email failed to send, check console for OTP.");
      }
    } 
    
    // Always log to console for development
    console.log(`🔑 DEBUG OTP for ${email || phone}: ${otp}`);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Login OTP Error:", error);
    return res.status(500).json({ message: "OTP error", error: error.message });
  }
};

exports.verifyLoginOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;
    const query = email ? { email } : { phone };
    const user = await User.findOne(query);

    // FIX 1: Check if user exists BEFORE checking the OTP
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // FIX 2: Check validity
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Optional: Clear OTP after successful use
    user.otp = null;
    await user.save();

    const token = jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET || "temporary_secret_key", 
    { expiresIn: "1d" }
  );
    return res.status(200).json({ 
      message: "Login successful",
      token, 
      user: { email: user.email, name: user.name } 
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ message: "Verification error", error: error.message });
  }
};