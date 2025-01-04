import React from "react";
import { Routes, Route } from "react-router-dom";

//importing pages
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import UserDashboard from "./pages/UserDashboard";
import VehicleRequestForm from "./pages/VehicleRequestForm";
import DriverDashboard from "./pages/DriverDashboard";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Registration />} />
      {/* Login Page */}
      <Route path="/" element={<Login />} />

      {/* User Dashboard */}
      <Route path="/user-dashboard" element={<UserDashboard />} />

      {/* Vehicle Request Form */}
      <Route path="/request-vehicle" element={<VehicleRequestForm />} />

      {/* Driver dashboard*/}
      <Route path="/driver-dashboard" element={<DriverDashboard />} />
    </Routes>
  );
}

export default App;
