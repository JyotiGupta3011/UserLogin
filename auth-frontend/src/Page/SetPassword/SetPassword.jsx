import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = sessionStorage.getItem("tempEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords do not match");

    setLoading(true);
    try {
      await axios.post(process.env.REACT_APP_API_URL + "/api/set-password" , { email, password });
      alert("✅ Account created successfully!");
      navigate("/login-password");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to set password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8">Set Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border rounded-2xl focus:outline-none focus:border-indigo-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-5 py-3 border rounded-2xl focus:outline-none focus:border-indigo-500" required />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold text-lg"
          >
            {loading ? "Setting Password..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;