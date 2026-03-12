const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    // Add lowercase to prevent "Email" vs "email" issues
    lowercase: true, 
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function(v) {
        // Updated regex: Allows 10, 11, or 12 digits
        return /^\d{10,12}$/.test(v); 
      },
      message: props => `${props.value} is not a valid phone number! Use 10-12 digits.`
    }
  },
  password: String,
  otp: String,
  otpExpiry: Date,
  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);