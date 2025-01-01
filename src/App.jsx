import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/login";
import "./App.css";
import UserDashboard from "./pages/UserDashboard";
import VehicleRequestForm from "./pages/VehicleRequestForm";
import DriverDashboard from "./pages/DriverDashboard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<Login />} />

          {/* User Dashboard */}
          <Route path="/user-dashboard" element={<UserDashboard />} />

          {/* Vehicle Request Form */}
          <Route path="/request-vehicle" element={<VehicleRequestForm />} />

          {/* Driver dashboard*/}
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
