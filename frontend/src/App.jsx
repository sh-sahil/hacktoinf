import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Chat from "./components/Chat";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import PatientDashboard from "./components/PatientDashboard";
import DailyRoutine from "./components/DailyRoutine";
import Activity from "./components/Activity";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-blue-600 p-4 text-white shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition">
              AI Companion
            </Link>
            <div className="space-x-6">
              {user ? (
                <>
                  <Link to="/dashboard" className="hover:text-blue-200 transition">
                    Dashboard
                  </Link>
                  <Link to="/daily-routine" className="hover:text-blue-200 transition">
                    Daily Routine
                  </Link>
                  <Link to="/profile" className="hover:text-blue-200 transition">
                    Profile
                  </Link>
                  <Link to="/chat" className="hover:text-blue-200 transition">
                    Chat
                  </Link>
                  <button onClick={handleLogout} className="hover:text-blue-200 transition">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="hover:text-blue-200 transition">
                  Login
                </Link>
              )}
              {admin ? (
                <>
                  <Link to="/admin/dashboard" className="hover:text-blue-200 transition">
                    Admin Dashboard
                  </Link>
                  <button onClick={handleAdminLogout} className="hover:text-blue-200 transition">
                    Admin Logout
                  </button>
                </>
              ) : (
                <Link to="/admin/login" className="hover:text-blue-200 transition">
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/daily-routine" element={<DailyRoutine />} />
          <Route path="/activity/:activityId" element={<Activity />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
