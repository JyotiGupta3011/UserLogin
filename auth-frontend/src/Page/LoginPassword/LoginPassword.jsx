import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPassword = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login-password`, form);
      localStorage.setItem("token", res.data.token);
      alert("✅ Login Successful!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Login with Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            className="w-full px-5 py-3 border rounded-2xl focus:outline-none focus:border-indigo-500" required />
          
          <input type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            className="w-full px-5 py-3 border rounded-2xl focus:outline-none focus:border-indigo-500" required />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold text-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPassword;