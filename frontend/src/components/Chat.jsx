import React, { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/interact",
        { textInput: message, voiceInput: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponses([
        ...responses,
        { message, response: res.data.response, distressScore: res.data.distressScore },
      ]);
      setMessage("");
    } catch (error) {
      alert("Error: " + error.response.data.error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Chat with AI Companion</h2>
        <div className="h-64 overflow-y-auto mb-4 p-2 bg-gray-50 rounded">
          {responses.map((item, index) => (
            <div key={index} className="mb-2">
              <p className="text-gray-800">
                <strong>You:</strong> {item.message}
              </p>
              <p className="text-blue-600">
                <strong>AI:</strong> {item.response} (Distress Score: {item.distressScore})
              </p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="How are you feeling?"
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
