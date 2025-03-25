import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Profile</h2>
        <p>
          <strong>Name:</strong> {profile.name}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Age:</strong> {profile.age || "Not set"}
        </p>
        <p>
          <strong>Gender:</strong> {profile.gender || "Not set"}
        </p>
        <p>
          <strong>Daily Routine:</strong> {profile.dailyRoutine || "Not set"}
        </p>
        <h3 className="text-xl font-semibold mt-4">Recent Interactions</h3>
        <ul className="mt-2 space-y-2">
          {profile.interactions.map((interaction, index) => (
            <li key={index} className="p-2 bg-gray-50 rounded">
              <p>
                <strong>Text:</strong> {interaction.textInput || interaction.voiceInput}
              </p>
              <p>
                <strong>Distress Score:</strong> {interaction.distressScore}
              </p>
              <p>
                <strong>Suggestion:</strong> {interaction.suggestedAction}
              </p>
              <p>
                <strong>Time:</strong> {new Date(interaction.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
