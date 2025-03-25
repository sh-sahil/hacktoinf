import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      if (!token || !user) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-white border-r w-16 md:w-64 flex flex-col fixed h-full shadow-md">
        <div className="flex items-center justify-center py-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              AI
            </div>
            <span className="hidden md:block font-bold text-lg text-blue-600">AI Companion</span>
          </div>
        </div>
        <div className="flex-1">
          <ul className="space-y-2 px-2">
            <li>
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "overview"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span className="hidden md:block ml-3">Overview</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/daily-routine")}
                className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="hidden md:block ml-3">Daily Routine</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("interactions")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "interactions"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-2a2 2 0 012-2h10a2 2 0 012 2v2h-4m-6 0h6"
                  />
                </svg>
                <span className="hidden md:block ml-3">Interactions</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab("strategies")}
                className={`w-full flex items-center p-3 rounded-lg ${
                  activeTab === "strategies"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="hidden md:block ml-3">Strategies</span>
              </button>
            </li>
          </ul>
        </div>
        <div className="p-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden md:block ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-16 md:ml-64">
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-blue-600">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "interactions" && "Your Interactions"}
            {activeTab === "strategies" && "Coping Strategies"}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleChat}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-2a2 2 0 012-2h10a2 2 0 012 2v2h-4m-6 0h6"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {userData.name[0]}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">{userData.name}</p>
                <p className="text-xs text-gray-500">{userData.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* User Profile */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold text-blue-600 mb-4">Your Profile</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p>
                      <strong>Name:</strong> {userData.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {userData.email}
                    </p>
                    <p>
                      <strong>Age:</strong> {userData.age || "Not set"}
                    </p>
                    <p>
                      <strong>Gender:</strong> {userData.gender || "Not set"}
                    </p>
                    <p className="md:col-span-2">
                      <strong>Daily Routine:</strong> {userData.dailyRoutine || "Not set"}
                    </p>
                  </div>
                </div>

                {/* Recent Interactions */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold text-blue-600 mb-4">Recent Interactions</h2>
                  {userData.interactions.length > 0 ? (
                    <ul className="space-y-3">
                      {userData.interactions.slice(-3).map((interaction, index) => (
                        <li key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p>
                            <strong>You:</strong> {interaction.textInput || interaction.voiceInput}
                          </p>
                          <p>
                            <strong>AI:</strong> {interaction.suggestedAction}
                          </p>
                          <p>
                            <strong>Distress Score:</strong> {interaction.distressScore}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(interaction.timestamp).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No interactions yet. Start chatting!</p>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "interactions" && (
              <motion.div
                key="interactions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-lg font-semibold text-blue-600 mb-4">All Interactions</h2>
                {userData.interactions.length > 0 ? (
                  <ul className="space-y-3 max-h-[70vh] overflow-y-auto">
                    {userData.interactions.map((interaction, index) => (
                      <li key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p>
                          <strong>You:</strong> {interaction.textInput || interaction.voiceInput}
                        </p>
                        <p>
                          <strong>AI:</strong> {interaction.suggestedAction}
                        </p>
                        <p>
                          <strong>Distress Score:</strong> {interaction.distressScore}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(interaction.timestamp).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No interactions yet. Start chatting!</p>
                )}
              </motion.div>
            )}

            {activeTab === "strategies" && (
              <motion.div
                key="strategies"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h2 className="text-lg font-semibold text-blue-600 mb-4">Coping Strategies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-md font-medium text-blue-700">Breathing Exercise</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Inhale for 4 seconds, hold for 4, exhale for 4. Repeat 5 times.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-md font-medium text-blue-700">Journaling</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Write down your thoughts for 10 minutes to clear your mind.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-md font-medium text-blue-700">Mindfulness</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Focus on your surroundings for 5 minutes—notice 5 things you see, hear, or
                      feel.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-md font-medium text-blue-700">Quick Stretch</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Stand up, stretch your arms and legs for 2 minutes to relax your body.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Chat Component */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg p-4">
          <Chat />
          <button
            onClick={toggleChat}
            className="absolute top-2 right-2 text-red-600 hover:text-red-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
