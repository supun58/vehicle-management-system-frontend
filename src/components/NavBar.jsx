import React from "react";
import { useLocation } from "react-router-dom";
import { Car } from "lucide-react"; // Ensure this is imported
import SideNav from "./SideNav"; // Ensure SideNav is implemented

export default function Navbar() {
  const location = useLocation(); // Get the current route
  const role = sessionStorage.getItem("role") || "User"; // Get user role

  return (
    <nav className="bg-maroon-800 text-ash-100 shadow-xl fixed top-0 left-0 w-full z-50">
      {location.pathname !== "/" && <SideNav />}{" "}
      {/* Render SideNav conditionally */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Car className="h-8 w-8 text-ash-200" />
            <span className="ml-2 text-xl font-bold text-ash-100">
              UniTransit
            </span>
          </div>

          {/* Conditional Rendering */}
          <div className="flex items-center space-x-4">
            {/* Welcome Message */}
            {location.pathname !== "/" && (
              <span className="text-ash-200">Welcome, {role}</span>
            )}

            {/* Show Visitor Link on Login Page */}
            {location.pathname === "/" && (
              <span className="text-white">
                Are you a visitor?{" "}
                <a
                  href="/visitor"
                  className="text-red-500 underline hover:text-red-700 transition duration-300"
                >
                  Visit here
                </a>
              </span>
            )}

            {/* Show Logout Button on Other Pages */}
            {location.pathname !== "/" && (
              <button
                className="bg-ash-600 text-white px-4 py-2 rounded-md hover:bg-ash-500 transition duration-300"
                onClick={() => {
                  sessionStorage.clear();
                  window.location.href = "/"; // Redirect to login page
                }}
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
