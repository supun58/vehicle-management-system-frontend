import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/auth/vehicles")
      .then((res) => res.json())
      .then((data) => setVehicles(data))
      .catch((err) => console.error("Error fetching vehicles:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-800 to-yellow-700 p-6 text-white">
      <h2 className="text-3xl font-bold mb-4">Manage Vehicles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.registrationNumber}
            className="p-4 rounded-lg bg-gray-900 shadow-lg hover:shadow-xl transition cursor-pointer bg-white/30 backdrop-blur-md p-4 rounded-xl shadow-md"
            onClick={() =>
              navigate(`/navigate-vehicle/${vehicle.registrationNumber}`)
            }
          >
            <img
              src={`data:${vehicle.contentType};base64,${vehicle.imageUrl}`}
              alt="Vehicle"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold text-center">
              {vehicle.model}
            </h3>
            <h3 className="text-lg font-semibold text-center">
              {vehicle.registrationNumber}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleManagement;
