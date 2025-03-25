import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const Activity = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();

  const activities = {
    breathing: {
      name: "Breathing Exercise",
      icon: "💨",
      description: "A simple exercise to calm your mind and reduce stress.",
      instructions: [
        "Sit comfortably in a quiet place.",
        "Inhale deeply through your nose for 4 seconds.",
        "Hold your breath for 4 seconds.",
        "Exhale slowly through your mouth for 4 seconds.",
        "Repeat this cycle 5 times or until you feel relaxed.",
      ],
    },
    journal: {
      name: "Journal Prompt",
      icon: "✍️",
      description: "Reflect on your thoughts with a guided writing exercise.",
      instructions: [
        "Find a quiet spot and grab a pen and paper or a digital note.",
        "Today’s prompt: 'What’s one thing weighing on your mind right now, and how can you address it?'",
        "Write freely for 10 minutes without stopping.",
        "Afterward, read what you wrote and note any insights.",
      ],
    },
    mindfulness: {
      name: "Mindfulness Activity",
      icon: "🧘",
      description: "Stay present and grounded with this quick exercise.",
      instructions: [
        "Sit or stand in a comfortable position.",
        "Take 5 deep breaths to center yourself.",
        "Notice 5 things you can see, 4 you can hear, 3 you can feel, 2 you can smell, and 1 you can taste.",
        "Spend a minute focusing on each sensation.",
      ],
    },
    stretch: {
      name: "Quick Stretch",
      icon: "🤸",
      description: "Relieve physical tension with simple stretches.",
      instructions: [
        "Stand up and find a clear space.",
        "Raise your arms overhead and stretch upward for 10 seconds.",
        "Bend forward at the hips, reaching for your toes, and hold for 10 seconds.",
        "Stand back up and roll your shoulders backward 5 times.",
        "Repeat this sequence twice.",
      ],
    },
  };

  const activity = activities[activityId] || {
    name: "Activity Not Found",
    description: "Please select a valid activity.",
    instructions: [],
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-blue-600">{activity.name}</h1>
          <button
            onClick={() => navigate("/daily-routine")}
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
            Back
          </button>
        </div>

        {/* Activity Details */}
        <div className="text-center mb-6">
          <span className="text-4xl">{activity.icon}</span>
          <p className="text-gray-600 mt-2">{activity.description}</p>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-blue-700">How to Do It</h2>
          <ul className="space-y-3">
            {activity.instructions.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">
                  {index + 1}
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <button
          onClick={() => alert("Great job! Try it out and feel the difference.")}
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          I’ve Tried It!
        </button>
      </div>
    </div>
  );
};

export default Activity;
