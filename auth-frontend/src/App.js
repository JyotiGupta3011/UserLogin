import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Register from "./Page/Register/Register";
import VerifyOTP from "./Page/VerifyOTP/VerifyOTP";
import SetPassword from "./Page/SetPassword/SetPassword";
import LoginPassword from "./Page/LoginPassword/LoginPassword";
import LoginOTP from "./Page/LoginOTP/LoginOTP";
import Dashboard from "./Page/Dashboard/Dashboard"; 
import ProtectedRoute from "./Components/ProtectedRoute"; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Protected Route */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/login-password" element={<LoginPassword />} />
          <Route path="/login-otp" element={<LoginOTP />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;