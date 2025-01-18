import React, { useState } from "react";
import {
  Home,
  LogIn,
  Truck,
  Users,
  Shield,
  LayoutDashboard,
  Info,
  Menu,
  X,
} from "lucide-react";

export default function SideNav() {
  const [isNavVisible, setNavVisible] = useState(false); // State for navbar visibility

  const navItems = [
    { icon: <Home size={20} />, label: "Home", href: "/" },
    { icon: <LogIn size={20} />, label: "Login", href: "/login" },
    { icon: <Info size={20} />, label: "About", href: "/about" },
    { icon: <Truck size={20} />, label: "Driver", href: "/driver" },
    { icon: <Users size={20} />, label: "User", href: "/user" },
    { icon: <Shield size={20} />, label: "Guard", href: "/guard" },
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "/dashboard",
    },
  ];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setNavVisible(!isNavVisible)} // Toggle navbar visibility
        className="fixed top-4 left-4 bg-maroon-800  p-2 rounded-full shadow-md hover:bg-maroon-700 transition duration-300 focus:outline-none z-50"
      >
        {isNavVisible ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navbar */}
      {isNavVisible && (
        <div className="fixed left-0 top-0 h-screen w-64 bg-maroon-800 text-ash-100 p-4 shadow-xl z-40">
          <div className="mb-8 px-4">
            <h1 className="text-2xl font-bold">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UniTransit
            </h1>
          </div>
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-maroon-700 transition-colors duration-200"
              >
                <span className="text-white">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
