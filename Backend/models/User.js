const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); 
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
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