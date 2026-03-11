import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/login-password");
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">Welcome Home!</h1>
        <p className="text-gray-600 mb-8">You have successfully authenticated.</p>
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-semibold transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;