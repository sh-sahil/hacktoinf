import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/admin/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Admin Dashboard</h2>
        <h3 className="text-xl font-semibold mb-2">Patients</h3>
        <div className="space-y-4">
          {patients.map(patient => (
            <div key={patient._id} className="p-4 bg-gray-50 rounded">
              <p>
                <strong>Name:</strong> {patient.name}
              </p>
              <p>
                <strong>Email:</strong> {patient.email}
              </p>
              <p>
                <strong>Interactions:</strong> {patient.interactions.length}
              </p>
              <p>
                <strong>Last Interaction:</strong>{" "}
                {patient.interactions.length > 0
                  ? new Date(
                      patient.interactions[patient.interactions.length - 1].timestamp
                    ).toLocaleString()
                  : "None"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
