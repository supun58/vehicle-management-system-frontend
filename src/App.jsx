import React from "react";
import { Routes, Route } from "react-router-dom";

//importing components
import Footer from "./components/footer";
import Navbar from "./components/NavBar";

//importing controllers
import { AuthProvider } from "./controllers/authcontext";

//importing pages
import Login from "./pages/login";
import Registration from "./pages/Registration";
import UserDashboard from "./pages/UserDashboard";
import VehicleRequestForm from "./pages/VehicleRequestForm";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Admin1Dashboard from "./pages/FacultyAdminDashboard.jsx";
import AboutUs from "./pages/AboutUs";
import VisitorForm from "./pages/GatePassForm";
import PendingRequests from "./pages/Admin-Dashboard/PendingRequests.jsx";
import GuardDashboard from "./pages/GuardDashboard.jsx";
import RequestDetails from "./pages/Admin-Dashboard/RequestDetails.jsx";
import UserManagement from "./pages/Admin-Dashboard/UserManagement.jsx";
import RequestStatus from "./pages/Admin-Dashboard/RequestStatus.jsx";
import AddVehicleForm from "./AddVehicleForm.jsx";
import VehicleManagement from "./pages/Admin-Dashboard/VehicleManagement.jsx";
import NavigateVehicle from "./pages/Admin-Dashboard/NavigateVehicle.jsx";

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />

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

          {/* Admin dashboard*/}
          <Route path="/Admin-dashboard" element={<AdminDashboard />} />
          {/* Add vehicle*/}
          <Route path="/add-vehicle" element={<AddVehicleForm />} />

          {/* Admin1 dashboard*/}
          <Route
            path="/faculty-admin-dashboard"
            element={<Admin1Dashboard />}
          />

          {/*Guard dashboard */}
          <Route path="/guard-dashboard" element={<GuardDashboard />} />

          {/* About Us*/}
          <Route path="/about-us" element={<AboutUs />} />

          {/* Visitor Form */}
          <Route path="/visitor" element={<VisitorForm />} />

          {/*pending requests */}
          <Route path="/pending-requests" element={<PendingRequests />} />

          {/* User Management */}
          <Route path="/user-management" element={<UserManagement />} />

          {/* Vehicle Management */}
          <Route path="/vehicle-management" element={<VehicleManagement />} />

          {/* Vehicle Navigation */}
          <Route
            path="/navigate-vehicle/:regNumber"
            element={<NavigateVehicle />}
          />

          {/* Request Details */}
          <Route path="/request-details/:id" element={<RequestDetails />} />

          {/* Request Status */}
          <Route path="/request-status/:id" element={<RequestStatus />} />
        </Routes>

        {/* Footer */}

        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
