import React, { useState } from "react";
import axios from "axios";

const WhatsAppChat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRunWhatsApp = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first");
        setIsLoading(false);
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/run-whatsapp",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(
        "WhatsApp script is running in a new browser window! Please scan the QR code to log in."
      );
    } catch (error) {
      console.error("Error running WhatsApp script:", error);
      setMessage("Failed to start WhatsApp script. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="section active"
      style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="section-header">
        <h2 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>WhatsApp Chat</h2>
        <div className="chat-input" style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleRunWhatsApp}
            disabled={isLoading}
            style={{
              padding: "12px 25px",
              background: isLoading ? "#e55a5a" : "#ff6b6b",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={e => !isLoading && (e.target.style.background = "#e55a5a")}
            onMouseOut={e => !isLoading && (e.target.style.background = "#ff6b6b")}
          >
            {isLoading ? "Starting..." : "Talk on WhatsApp"}
          </button>
        </div>
      </div>
      {message && (
        <div
          className="chat-message"
          style={{ background: "#f9f9f9", padding: "10px", borderRadius: "8px", marginTop: "10px" }}
        >
          <p style={{ fontSize: "1rem" }}>{message}</p>
        </div>
      )}
    </div>
  );
};

export default WhatsAppChat;
