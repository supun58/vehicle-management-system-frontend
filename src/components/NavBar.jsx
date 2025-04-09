import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Car } from "lucide-react";
import SideNav from "./SideNav";
import { useAuth } from "../controllers/authcontext";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const {isAuthenticated, logout } = useAuth(); // Proper destructuring of full_name
 
  const userData = localStorage.getItem('userData');

const fullName = userData ? JSON.parse(userData).full_name : '';

  // Don't render the navbar if not authenticated (except for public pages)
  const publicPages = ["/", "/register", "/visitor", "/about-us"];
  if (!publicPages.includes(location.pathname) && !isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-maroon-800 text-ash-100 shadow-xl fixed top-0 left-0 w-full z-50">
      {isAuthenticated && location.pathname !== "/" && <SideNav />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Title */}
          <a href="/" className="flex items-center">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-ash-200" />
            <span className="ml-2 text-xl font-bold text-ash-100">
              UniTransit
            </span>
          </div>
          </a>

          {/* Conditional Rendering */}
          <div className="flex items-center space-x-4">
            {/* Welcome Message */}
            {isAuthenticated && !publicPages.includes(location.pathname) && (
              <span className="text-ash-200">Welcome, {fullName}</span>
            )}

            {/* Show Visitor Link on Login/Register Pages */}
            { (location.pathname === "/" || location.pathname === "/register") && (
              <span className="text-white">
                Are you a visitor?&nbsp;&nbsp;
                <button
                  className="bg-[#de9e28] text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
                  onClick={() => navigate("/visitor")}
                >
                  Gate Pass
                </button>
              </span>
            )}

            {/* Show Logout Button on Authenticated Pages */}
            {isAuthenticated && !publicPages.includes(location.pathname) && (
              <button
                className="bg-ash-600 text-white px-4 py-2 rounded-md hover:bg-ash-500 transition duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}