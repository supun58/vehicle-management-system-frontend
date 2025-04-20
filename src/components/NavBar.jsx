import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Car } from "lucide-react";
import SideNav from "./SideNav";
import { useAuth } from "../controllers/authcontext";
import axios from "axios";

import { FaUser } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth(); // Proper destructuring of full_name

  const userData = localStorage.getItem("userData");

  const fullName = userData ? JSON.parse(userData).full_name : "";

  // Don't render the navbar if not authenticated (except for public pages)
  const publicPages = ["/", "/register", "/visitor", "/about-us"];
  if (!publicPages.includes(location.pathname) && !isAuthenticated) {
    return null;
  }
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleToggle = () => {
    setOpen(!open);
  };

  const handleProfile = () => {
    navigate("/profile:id");
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [profilePic, setProfilePic] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/users/${userId}`
        );
        const user = res.data;
        if (user.profilePicUrl) {
          setProfilePic(`http://localhost:5000${user.profilePicUrl}`);
        }
      } catch (error) {
        console.error("Error fetching profile pic:", error);
      }
    };

    if (userId) {
      fetchProfilePic();
    }
  }, [userId]);
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
            {(location.pathname === "/" ||
              location.pathname === "/register") && (
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
            {/* Show user icon on Authenticated Pages */}
            {isAuthenticated && !publicPages.includes(location.pathname) && (
              <div>
                <div
                  style={{ position: "relative", display: "inline-block" }}
                  ref={dropdownRef}
                >
                  <button
                    onClick={handleToggle}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "24px",
                    }}
                    aria-label="User menu"
                  >
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                      />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-white text-slate-800 rounded-full border-2 border-white shadow">
                        <FaUser className="text-xl" />
                      </div>
                    )}
                  </button>

                  {open && (
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "100%",
                        backgroundColor: "#800000", // dark maroon
                        color: "white",
                        padding: "0.5rem",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                        borderRadius: "10px",
                        overflow: "hidden",
                        zIndex: 1000,
                        minWidth: "150px",
                      }}
                    >
                      <a
                        onClick={handleProfile}
                        style={{
                          display: "block",
                          padding: "10px",
                          textDecoration: "none",
                          color: "white",
                          borderBottom: "1px solid #a94442",
                          backgroundColor: "#a94442", // light maroon
                        }}
                      >
                        View Profile
                      </a>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: "100%",
                          padding: "10px",
                          backgroundColor: "#800000",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
