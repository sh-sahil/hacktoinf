import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DailyRoutine = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distressSigns, setDistressSigns] = useState([]);
  const [suggestedActivities, setSuggestedActivities] = useState([
    {
      id: "breathing",
      name: "Breathing Exercise",
      description: "Calm your mind with deep breathing.",
      icon: "💨",
    },
    {
      id: "journal",
      name: "Journal Prompt",
      description: "Reflect on your day with guided prompts.",
      icon: "✍️",
    },
    {
      id: "mindfulness",
      name: "Mindfulness Activity",
      description: "Focus on the present moment.",
      icon: "🧘",
    },
    {
      id: "stretch",
      name: "Quick Stretch",
      description: "Relieve physical tension with a stretch.",
      icon: "🤸",
    },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data);
        analyzeRoutine(res.data.dailyRoutine);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const analyzeRoutine = routine => {
    if (!routine) {
      setDistressSigns(["No routine provided yet. Add one to get personalized insights!"]);
      return;
    }

    const lowerRoutine = routine.toLowerCase();
    const signs = [];
    if (
      lowerRoutine.includes("late") ||
      lowerRoutine.includes("sleep") ||
      lowerRoutine.includes("tired")
    ) {
      signs.push("Possible sleep disruption detected.");
    }
    if (
      lowerRoutine.includes("busy") ||
      lowerRoutine.includes("work") ||
      lowerRoutine.includes("stress")
    ) {
      signs.push("High workload or stress indicators found.");
    }
    if (lowerRoutine.includes("alone") || lowerRoutine.includes("no time")) {
      signs.push("Potential isolation or lack of personal time.");
    }
    if (signs.length === 0) {
      signs.push("Your routine looks balanced! Keep it up.");
    }
    setDistressSigns(signs);
  };

  const handleActivityClick = activityId => {
    navigate(`/activity/${activityId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your routine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <header className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-blue-600">Daily Routine Analysis</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
        </header>

        {/* Routine Display */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Your Daily Routine</h2>
          <p className="text-gray-700">
            {userData?.dailyRoutine || "You haven’t set a daily routine yet."}
          </p>
          {userData?.dailyRoutine && (
            <div className="mt-4">
              <h3 className="text-md font-medium text-blue-700">Analysis</h3>
              <ul className="mt-2 space-y-2">
                {distressSigns.map((sign, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <svg
                      className="h-5 w-5 text-red-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Suggested Activities */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-blue-600 mb-4">Tailored Coping Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestedActivities.map(activity => (
              <button
                key={activity.id}
                onClick={() => handleActivityClick(activity.id)}
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-left"
              >
                <span className="text-2xl">{activity.icon}</span>
                <h3 className="text-md font-medium text-blue-700 mt-2">{activity.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyRoutine;
