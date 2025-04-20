import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";

const NavigateVehicle = () => {
  const { regNumber } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/vehicles/${regNumber}`)
      .then((res) => res.json())
      .then((data) => setVehicle(data))
      .catch((err) => console.error("Error fetching vehicles:", err));
  }, []);

  const handleRemove = async (registrationNumber) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/auth/vehicles/${registrationNumber}`
      );
      setAlert({
        title: "Vehicle Deleted",
        message: "The vehicle has been successfully deleted.",
      });
      navigate("/vehicle-management"); // Or wherever you want to go after deletion
    } catch (error) {
      console.error("Error deleting vehicle:", error);
    }
  };

  return vehicle ? (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-2xl shadow-md mt-24">
      {alert && (
        <Alert
          title={alert.title}
          message={alert.message}
          setAlertVisible={(visible) => setAlert({ ...alert, visible })}
        />
      )}

      <img
        className=" mb-4 w-full h-60 object-cover rounded-xl"
        src={
          vehicle.imageUrl
            ? `data:${vehicle.contentType};base64,${vehicle.imageUrl}`
            : "https://via.placeholder.com/400x200?text=No+Image"
        }
        alt="Vehicle"
      />
      <h2 className="text-2xl font-bold mb-2">{vehicle.registrationNumber}</h2>
      <p>
        <strong>Make:</strong> {vehicle.make}
      </p>
      <p>
        <strong>Model:</strong> {vehicle.model}
      </p>
      <p>
        <strong>Year:</strong> {vehicle.year}
      </p>
      <p>
        <strong>Color:</strong> {vehicle.color}
      </p>
      <p>
        <strong>Capacity:</strong> {vehicle.capacity}
      </p>
      <p>
        <strong>Milege:</strong> {vehicle.milege}
      </p>
      <p>
        <strong>Status:</strong> {vehicle.status}
      </p>

      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
        onClick={() => handleRemove(vehicle.registrationNumber)}
      >
        Remove Vehicle
      </button>
    </div>
  ) : (
    <div className="text-center mt-8">Loading vehicle details...</div>
  );
};

export default NavigateVehicle;
