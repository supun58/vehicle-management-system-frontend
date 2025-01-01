import React from "react";
import { Car, Calendar, QrCode } from "lucide-react";
import UniLogo from "../assets/UniLogo.jpg";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500">
      {/* Navbar */}
      <nav className="bg-maroon-800 shadow-xl fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div>
                <img src={UniLogo} alt="Logo" className="w-16 h-auto" />
              </div>
              <span className="ml-2 text-xl font-bold text-ash-100">
                University of Ruhuna
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-ash-200">Welcome, John Doe</span>
              <button className="bg-ash-600 text-white px-4 py-2 rounded-md hover:bg-ash-500 transition duration-300">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Request Vehicle Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300">
              <div className="flex items-center mb-4">
                <Car className="h-6 w-6 text-maroon-600" />
                <h3 className="ml-2 text-xl font-bold text-maroon-700">
                  Request a Vehicle
                </h3>
              </div>
              <p className="text-ash-600 mb-6">
                Easily request a vehicle for your trips or official purposes.
              </p>
              <button className="w-full bg-maroon-700 text-white px-6 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                Request Now
              </button>
            </div>

            {/* Trip Details Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-ash-600" />
                <h3 className="ml-2 text-xl font-bold text-ash-700">
                  Trip Details
                </h3>
              </div>
              <p className="text-ash-600 mb-6">
                View and manage your trip details, schedules, and history.
              </p>
              <button className="w-full bg-ash-600 text-white px-6 py-2 rounded-md hover:bg-ash-500 transition duration-300">
                View Details
              </button>
            </div>

            {/* QR Code Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300">
              <div className="flex items-center mb-4">
                <QrCode className="h-6 w-6 text-ash-800" />
                <h3 className="ml-2 text-xl font-bold text-ash-800">QR Code</h3>
              </div>
              <p className="text-ash-600 mb-6">
                Scan QR codes for vehicle tracking and access.
              </p>
              <button className="w-full bg-ash-800 text-white px-6 py-2 rounded-md hover:bg-ash-700 transition duration-300">
                Scan QR
              </button>
            </div>
          </div>

          {/* Recent Trips Table */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 text-maroon-700">
              Recent Trips
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-ash-100">
                  <tr>
                    <th className="px-6 py-3 text-ash-700 font-bold uppercase text-sm">
                      Date
                    </th>
                    <th className="px-6 py-3 text-ash-700 font-bold uppercase text-sm">
                      Purpose
                    </th>
                    <th className="px-6 py-3 text-ash-700 font-bold uppercase text-sm">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-ash-700 font-bold uppercase text-sm">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ash-200">
                  <tr className="hover:bg-ash-50">
                    <td className="px-6 py-4 text-sm text-ash-800">
                      2024-03-15
                    </td>
                    <td className="px-6 py-4 text-sm text-ash-600">
                      Client Meeting
                    </td>
                    <td className="px-6 py-4 text-sm text-ash-600">
                      Toyota Camry
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 inline-flex text-xs font-semibold leading-5 rounded-full bg-maroon-100 text-maroon-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-ash-50">
                    <td className="px-6 py-4 text-sm text-ash-800">
                      2024-03-14
                    </td>
                    <td className="px-6 py-4 text-sm text-ash-600">
                      Site Inspection
                    </td>
                    <td className="px-6 py-4 text-sm text-ash-600">
                      Honda CR-V
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 inline-flex text-xs font-semibold leading-5 rounded-full bg-maroon-100 text-maroon-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-maroon-800 text-ash-200 text-center py-4 mt-8">
        <p>
          &copy; 2024 FleetManager. All rights reserved. Designed by the Fleet
          Team.
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
