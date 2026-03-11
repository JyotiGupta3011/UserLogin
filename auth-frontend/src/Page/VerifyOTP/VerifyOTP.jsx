import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const navigate = useNavigate();

  const mode = sessionStorage.getItem("otpMode");
  const email = sessionStorage.getItem("tempEmail");

  useEffect(() => {
    if (mode === "register") setIdentifier(email);
  }, [mode, email]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const mode = sessionStorage.getItem("otpMode");
  const tempEmail = sessionStorage.getItem("tempEmail"); 
  const otpIdentifier = sessionStorage.getItem("otpIdentifier");
  const otpType = sessionStorage.getItem("otpType");

  try {
    const endpoint = mode === "register" ? "/api/verify-otp" : "/api/verify-login-otp";
    
    let payload = { otp };

    if (mode === "register") {
      payload.email = tempEmail;
    } else {
      // Login flow logic
      if (otpType === "email") {
        payload.email = otpIdentifier;
      } else {
        payload.phone = otpIdentifier;
      }
    }

    const res = await axios.post(`http://localhost:5000${endpoint}`, payload);

    if (mode === "register") {
      navigate("/set-password");
    } else {
      localStorage.setItem("token", res.data.token);
      alert("✅ Login Successful!");
      navigate("/");
    }
  } catch (err) {
    alert(err.response?.data?.message || "Invalid OTP");
  }
  setLoading(false);
};

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-2">Verify OTP</h2>
        <p className="text-gray-600 mb-8">We sent a 6-digit code to {identifier}</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="w-full text-center text-4xl tracking-[12px] font-mono border-2 border-dashed border-gray-300 focus:border-indigo-500 rounded-2xl py-6 focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold text-lg transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;