import React from "react";
import { Routes, Route } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";

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
import SendMessage from "./pages/Admin-Dashboard/SendMessage.jsx";
import EmergencyReport from "./pages/EmergencyReport.jsx";
import EmergencyHandle from "./pages/Admin-Dashboard/EmergencyHandle.jsx";
import TaskDetails from "./pages/Driver-Dashboard/TaskDetails.jsx";
import TrackingDashboard from "./pages/User-Dashboard/TrackingDashboard.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={["places", "marker"]}
      />
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

          {/* Send Message */}
          <Route path="send-message" element={<SendMessage />} />

          {/* Vehicle Navigation */}
          <Route
            path="/navigate-vehicle/:regNumber"
            element={<NavigateVehicle />}
          />

          {/* Request Details */}
          <Route path="/request-details/:id" element={<RequestDetails />} />

          {/* Request Status */}
          <Route path="/request-status/:id" element={<RequestStatus />} />

          {/* emergency report*/}
          <Route path="/emergency-report" element={<EmergencyReport />} />

          {/* emergency handle*/}
          <Route path="/emergency-handle" element={<EmergencyHandle />} />

          {/* Task Details */}
          <Route path="/task-details/:id" element={<TaskDetails />} />

          {/* Tracking Dashboard */}
          <Route path="/tracking-dashboard" element={<TrackingDashboard />} />

          {/* 404 Not Found */}
          <Route
            path="*"
            element={
              <div className="flex justify-center items-center h-screen">
                <h1 className="text-4xl font-bold">404 Not Found</h1>
              </div>
            }
          />
          {/* user profile*/}
          <Route path="/profile:id" element={<UserProfile />} />

          {/* Edit Profile */}
          <Route path="/edit-profile" element={<EditProfile />} />

          {/* Emergency Handle */}
        </Routes>

        {/* Footer */}

        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;
