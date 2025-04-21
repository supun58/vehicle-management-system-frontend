import React, { useState } from "react";
import axios from "axios";
import Alert from "./components/Alert";

function AddVehicleForm() {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    registrationNumber: "",
    vehicleType: "",
    year: "",
    color: "",
    capacity: "",
    mileage: "",
    status: "available",
    imageUrl: null,
  });

  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageUrl") {
      setFormData({
        ...formData,
        [name]: files[0], // Store the file itself
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const errorMessage = " Please try again.";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object
    const formDataToSend = new FormData();

    // Append the form data fields
    for (const key in formData) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      // Replace with your backend API endpoint
      const response = await axios.post(
        "https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/add-vehicle",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the header for form data
          },
        }
      );
      setAlert({
        visible: true,
        title: "Success",
        message: response.data.message,
      });

      // Clear form after successful submission (optional)
      setFormData({
        make: "",
        model: "",
        registrationNumber: "",
        vehicleType: "",
        year: "",
        color: "",
        capacity: "",
        mileage: "",
        status: "available",
        imageUrl: null,
      });
    } catch (error) {
      console.error(
        "Error adding vehicle:",
        error.response?.data || error.message
      );
      setAlert({
        visible: true,
        title: "Error",
        message: `Registration failed: ${errorMessage}`,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {alert.visible && (
        <Alert
          title={alert.title}
          message={alert.message}
          setAlertVisible={(visible) =>
            setAlert((prev) => ({ ...prev, visible }))
          }
        />
      )}

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg border border-gray-300 mt-14">
        <h2 className="text-3xl font-bold text-maroon-700 mb-6 text-center">
          Add Vehicle
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Make */}
          <div>
            <label className="block text-gray-700 font-bold">Make</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          {/* Model */}
          <div>
            <label className="block text-gray-700 font-bold">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          {/* Registration Number */}
          <div>
            <label className="block text-gray-700 font-bold">
              Registration Number
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          {/* Vehicle Type */}
          <div>
            <label className="block text-gray-700 font-bold">
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            >
              <option value="">Select type</option>
              <option value="Car">Car</option>
              <option value="Truck">Truck</option>
              <option value="Bus">Bus</option>
              <option value="Van">Van</option>
              <option value="SUV">SUV</option>
            </select>
          </div>
          {/* Year & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold">Color</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
          {/* Capacity & Mileage */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold">Mileage</label>
              <input
                type="number"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md"
              />
            </div>
          </div>
          {/* Status */}
          <div>
            <label className="block text-gray-700 font-bold">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            >
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          {/* Image Upload */}
          <div className="mt-4">
            <label className="block text-gray-700 font-bold">
              Vehicle Image
            </label>
            <input
              type="file"
              name="imageUrl"
              accept="image/*"
              onChange={handleChange}
              className="p-2 border border-gray-500 rounded w-full text-white"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300"
          >
            Add Vehicle
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddVehicleForm;
