import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginOTP = () => {
  const [method, setMethod] = useState("phone"); 
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (method === "phone" && value.length !== 10) {
      return alert("Please enter a valid 10-digit phone number.");
    }

    setLoading(true);

    try {
      const isPhone = method === "phone";
      const payload = isPhone ? { phone: value } : { email: value }; 
      await axios.post("${process.env.REACT_APP_API_URL}/api/login-otp", payload);

      sessionStorage.setItem("otpIdentifier", value); 
      sessionStorage.setItem("otpType", isPhone ? "phone" : "email");
      sessionStorage.setItem("otpMode", "login");
      
      navigate("/verify-otp");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Login with OTP</h2>

        <div className="flex gap-4 mb-6">
          <button 
            type="button"
            onClick={() => { setMethod("phone"); setValue(""); }}
            className={`flex-1 py-3 rounded-2xl font-medium ${method === "phone" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
          >
            Phone
          </button>
          <button 
            type="button"
            onClick={() => { setMethod("email"); setValue(""); }}
            className={`flex-1 py-3 rounded-2xl font-medium ${method === "email" ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
          >
            Email
          </button>
        </div>

        <form onSubmit={handleSendOTP}>
          <input
            type={method === "email" ? "email" : "tel"}
            placeholder={method === "email" ? "Enter Email" : "Enter 10-Digit Phone"}
            value={value}
            onChange={(e) => {
              const val = e.target.value;
              if (method === "phone") {
                const onlyNums = val.replace(/\D/g, "");
                if (onlyNums.length <= 10) setValue(onlyNums);
              } else {
                setValue(val);
              }
            }}
            className="w-full px-5 py-3 border rounded-2xl focus:outline-none focus:border-indigo-500 mb-6"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold text-lg disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginOTP;