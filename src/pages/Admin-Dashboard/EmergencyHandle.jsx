import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { AlertTriangle } from "lucide-react";
const DRIVER_ID = localStorage.getItem("driverId");

// Connect to the backend Socket.IO server
const socket = io("https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev", {
  transports: ["websocket"],
});

export default function EmergencyHandle() {
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    // Fetch past emergencies when the component mounts
    axios
      .get("https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/emergencies")
      .then((res) => setEmergencies(res.data))
      .catch((err) => console.error("Error fetching emergencies:", err));

    // Listen for real-time emergency notifications
    socket.on("newEmergency", (emergency) => {
      setEmergencies((prev) => [emergency, ...prev]);
    });

    // Cleanup when the component is unmounted
    return () => socket.off("newEmergency");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-blue-900 to-yellow-600 text-white p-6 mt-16">
      <div className="mb-6">
        <button className="text-white mb-4 hover:underline">
          ← Back to Dashboard
        </button>
        <h2 className="text-3xl font-bold">Emergency Alerts</h2>
      </div>

      <div className="mt-8 space-y-4">
        {emergencies.length > 0 ? (
          emergencies.map((emergency, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row bg-white bg-opacity-10 shadow-lg rounded-lg p-4 text-white"
            >
              <div className="flex-shrink-0 mr-4">
                <AlertTriangle className="text-red-400 h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{emergency.title}</h3>
                <p className="text-white">{emergency.description}</p>
                <div className="mt-2 text-sm text-gray-300">
                  <p>Location: {emergency.location}</p>
                  <p>Type: {emergency.emergencyType}</p>
                  <p>VehicleId: {emergency.vehicleId}</p>
                  <p>driverId: {DRIVER_ID}</p>
                  <p>Time: {new Date(emergency.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-lg">
            No emergency alerts at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
