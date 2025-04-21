import React, { useState } from "react";
import axios from "axios";
import Alert from "../components/Alert";

const EmergencyReport = () => {
  const [formData, setFormData] = useState({
    vehicleId: "",
    emergencyType: "",
    location: "",
    notes: "",
  });

  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/emergency",
        formData
      );

      setAlert({
        visible: true,
        title: "Emergency Reported",
        message:
          res.data?.message || "Your emergency has been reported successfully.",
      });

      setFormData({
        vehicleId: "",
        emergencyType: "",
        location: "",
        notes: "",
      });
    } catch (error) {
      setAlert({
        visible: true,
        title: "Submission Failed",
        message:
          error.response?.data?.message ||
          "Something went wrong while reporting the emergency.",
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#510A32] via-[#3A3A52] to-[#FFDA44] text-white mt-16">
      {alert.visible && (
        <Alert
          title={alert.title}
          message={alert.message}
          setAlertVisible={(visible) =>
            setAlert((prev) => ({ ...prev, visible }))
          }
        />
      )}

      <div className="max-w-md mx-auto bg-gradient-to-r from-[#3D1E3D] via-[#2D2D44] to-[#FFDA44] p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-[#FFDA44]">
          Report Emergency
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="vehicleId"
            placeholder="Vehicle ID"
            value={formData.vehicleId}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#2A2A40] text-white rounded-md border border-gray-600"
          />
          <select
            name="emergencyType"
            value={formData.emergencyType}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#2A2A40] text-white rounded-md border border-gray-600"
          >
            <option value="">Select Emergency Type</option>
            <option value="accident">Accident</option>
            <option value="breakdown">Breakdown</option>
            <option value="medical">Medical</option>
            <option value="security">Security Issue</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-3 bg-[#2A2A40] text-white rounded-md border border-gray-600"
          />
          <textarea
            name="notes"
            placeholder="Additional notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-3 bg-[#2A2A40] text-white rounded-md border border-gray-600"
          ></textarea>
          <button
            type="submit"
            className="w-full p-4 bg-gradient-to-r from-[#711C2F] via-[#393960] to-[#FFDA44] text-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmergencyReport;
