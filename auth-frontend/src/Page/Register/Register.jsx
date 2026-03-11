import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const onlyNums = value.replace(/\D/g, ""); 
      if (onlyNums.length <= 10) {
        setForm({ ...form, [name]: onlyNums });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.phone.length !== 10) {
      return alert("Phone number must be exactly 10 digits.");
    }

    setLoading(true);
    try {
      await axios.post(process.env.REACT_APP_API_URL + "/api/register", form);
      sessionStorage.setItem("tempEmail", form.email);
      sessionStorage.setItem("otpMode", "register");
      navigate("/verify-otp");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
              className="w-full px-5 py-3 border rounded-2xl focus:outline-none focus:border-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full px-5 py-3 border rounded-2xl focus:outline-none focus:border-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange}
              className="w-full px-5 py-3 border rounded-2xl focus:outline-none focus:border-indigo-500" required />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold transition text-lg disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;