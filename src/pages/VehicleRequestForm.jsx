import React, { useState } from "react";

export default function VehicleRequestForm() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    vehicleType: "",
    purpose: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Vehicle request submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Request a Vehicle
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Contact */}
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Number
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full p-2 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your contact number"
              required
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label
              htmlFor="vehicleType"
              className="block text-sm font-medium text-gray-700"
            >
              Vehicle Type
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full p-2 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="" disabled>
                Select vehicle type
              </option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="Bus">Bus</option>
            </select>
          </div>

          {/* Purpose */}
          <div>
            <label
              htmlFor="purpose"
              className="block text-sm font-medium text-gray-700"
            >
              Purpose
            </label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="w-full p-2 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Explain the purpose of the request"
              required
            ></textarea>
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition duration-300"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
