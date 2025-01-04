import React from "react";
import { Car } from "lucide-react";
import SideNav from "./SideNav";

function Navbar() {
  return (
    <nav className="bg-maroon-800 text-ash-100 shadow-xl fixed top-0 left-0 w-full z-50">
      <SideNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-ash-200" />
            <span className="ml-2 text-xl font-bold text-ash-100">
              UniTransit
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-ash-200">Welcome, User</span>
            <button className="bg-ash-600 text-white px-4 py-2 rounded-md hover:bg-ash-500 transition duration-300">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
