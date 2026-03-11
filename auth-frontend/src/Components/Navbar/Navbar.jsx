import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/login-password");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600">AuthSystem</Link>
        
        <div className="flex gap-8 text-sm font-medium items-center">
          {!token ? (
            <>
              <Link to="/register" className="hover:text-indigo-600 transition">Register</Link>
              <Link to="/login-password" className="hover:text-indigo-600 transition">Login (Pass)</Link>
              <Link to="/login-otp" className="hover:text-indigo-600 transition">Login (OTP)</Link>
            </>
          ) : (
            <>
              <Link to="/" className="hover:text-indigo-600 transition">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;