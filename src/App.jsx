import React from "react";
import { Routes, Route } from "react-router-dom";

//importing components
import Footer from "./components/footer";
import Navbar from "./components/NavBar";

//importing pages
import Login from "./pages/login";
import Registration from "./pages/Registration";
import UserDashboard from "./pages/UserDashboard";
import VehicleRequestForm from "./pages/VehicleRequestForm";
import DriverDashboard from "./pages/DriverDashboard";

function App() {
  return (

    <>
    <Navbar/>

    <Routes>
      {/* Login Page */}
      <Route path="/" element={<Login />} />

      {/*Registration Page */}
      <Route path="/register" element={<Registration />} />

      {/* User Dashboard */}
      <Route path="/user-dashboard" element={<UserDashboard />} />

      {/* Vehicle Request Form */}
      <Route path="/request-vehicle" element={<VehicleRequestForm />} />

      {/* Driver dashboard*/}
      <Route path="/driver-dashboard" element={<DriverDashboard />} />
    </Routes>

    <Footer/>
  </>

  );
}

export default App;
