import React, { useState, useEffect } from "react";

export default function VehicleRequestForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [distance, setDistance] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    vehicleType: "",
    purpose: "",
    date: "",
  });

  const places = [
    "Faculty of Science",
    "Main Library",
    "Auditorium",
    "Cafeteria",
    "Engineering Faculty",
    "Administration Building",
    "Hostels",
  ];

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];
    document.getElementById("date").setAttribute("min", minDate);
  }, []);

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-20"> 
      <div className="bg-white shadow-lg rounded-lg p-4 w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Request a Vehicle</h2> 
        <form onSubmit={handleSubmit} className="space-y-2"> 
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
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
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
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

          {/* Select Places */}
          <div>
            <h2 className="block text-sm font-medium text-gray-700">Select Places</h2>

            {/* From Dropdown */}
            <div className="mb-2"> 
              <select
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select starting point
                </option>
                {places.map((place, index) => (
                  <option key={index} value={place}>
                    {place}
                  </option>
                ))}
              </select>
            </div>

            {/* To Dropdown */}
            <div className="mb-2"> 
              <select
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select destination
                </option>
                {places.map((place, index) => (
                  <option key={index} value={place}>
                    {place}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Distance Field */}
          <div className="mb-2"> 
            <label htmlFor="distance" className="block text-gray-700 font-medium mb-1">
              Distance (in kms)
            </label>
            <input
              type="number"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              placeholder="Enter distance"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-maroon-700 text-white p-2 rounded-lg hover:bg-blue-500 transition duration-300"
          >
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
