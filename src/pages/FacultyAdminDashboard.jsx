import React from "react";
import { Calendar, MessageSquare, X, Car } from "lucide-react";

function Admin1Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500">
      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Faculty Admin Dashboard</h1>
            <p className="text-ash-200">Manage your transportation system efficiently</p>
          </div>

          {/* Cards Section */}
          <div className="flex flex-col items-center gap-6 mb-12">
            {/* First Row - Centered */}
            <div className="flex flex-col sm:flex-row justify-center gap-5 w-full">
              {/* Ongoing Trips Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-5 hover:transform hover:-translate-y-1 transition duration-300 w-full max-w-xs">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-maroon-100/50">
                    <Calendar className="h-5 w-5 text-maroon-600" />
                  </div>
                  <h3 className="ml-2 text-lg font-bold text-maroon-700">Ongoing Trips</h3>
                </div>
                <p className="text-ash-600 mb-4 text-sm">
                  Track and manage ongoing trips in real-time with live updates.
                </p>
                <button className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                  View Trips
                </button>
              </div>

              {/* Pending Requests Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-5 hover:transform hover:-translate-y-1 transition duration-300 w-full max-w-xs">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-maroon-100/50">
                    <X className="h-5 w-5 text-maroon-600" />
                  </div>
                  <h3 className="ml-2 text-lg font-bold text-maroon-700">Pending Requests</h3>
                </div>
                <p className="text-ash-600 mb-4 text-sm">
                  Review and approve pending transportation requests.
                </p>
                <a href="/pending-requests" className="block w-full">
                <button className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                  Manage Requests
                </button>
                </a>
              </div>

              {/* Messages Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-5 hover:transform hover:-translate-y-1 transition duration-300 w-full max-w-xs">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-maroon-100/50">
                    <MessageSquare className="h-5 w-5 text-maroon-600" />
                  </div>
                  <h3 className="ml-2 text-lg font-bold text-maroon-700">Messages</h3>
                </div>
                <p className="text-ash-600 mb-4 text-sm">
                  Communicate with drivers and staff through the messaging system.
                </p>
                <button className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                  View Messages
                </button>
              </div>
            </div>

            {/* Second Row - Centered */}
            <div className="flex flex-col sm:flex-row justify-center gap-5 w-full">
              {/* Request Vehicle Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-5 hover:transform hover:-translate-y-1 transition duration-300 w-full max-w-xs">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-maroon-100/50">
                    <Car className="h-5 w-5 text-maroon-600" />
                  </div>
                  <h3 className="ml-2 text-lg font-bold text-maroon-700">Request Vehicle</h3>
                </div>
                <p className="text-ash-600 mb-4 text-sm">
                  Schedule vehicles for official university transportation needs.
                </p>
                <a href="/request-vehicle" className="block w-full">
                  <button className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                    Request Now
                  </button>
                </a>
              </div>

              {/* Trip Details Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-5 hover:transform hover:-translate-y-1 transition duration-300 w-full max-w-xs">
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-maroon-100/50">
                    <Calendar className="h-5 w-5 text-maroon-600" />
                  </div>
                  <h3 className="ml-2 text-lg font-bold text-maroon-700">Past Trip History</h3>
                </div>
                <p className="text-ash-600 mb-4 text-sm">
                  Access complete records of past trips and transportation logs.
                </p>
                <button className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                  View History
                </button>
              </div>
            </div>
          </div>

          {/* Recent Trips Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-maroon-700">
                Recent Transportation Activity
              </h2>
              <button className="text-sm text-maroon-600 hover:text-maroon-800 font-medium">
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ash-100">
                  <tr className="text-left">
                    <th className="px-5 py-3 text-ash-700 font-semibold text-sm uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-5 py-3 text-ash-700 font-semibold text-sm uppercase tracking-wider">
                      Purpose
                    </th>
                    <th className="px-5 py-3 text-ash-700 font-semibold text-sm uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-5 py-3 text-ash-700 font-semibold text-sm uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ash-200">
                  <tr className="hover:bg-ash-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-ash-900">
                      2024-03-15
                    </td>
                    <td className="px-5 py-4 text-sm text-ash-600">
                      Faculty Meeting
                    </td>
                    <td className="px-5 py-4 text-sm text-ash-600">
                      Toyota Camry (UNI-001)
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-ash-50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-ash-900">
                      2024-03-14
                    </td>
                    <td className="px-5 py-4 text-sm text-ash-600">
                      Campus Tour
                    </td>
                    <td className="px-5 py-4 text-sm text-ash-600">
                      Ford Transit (UNI-007)
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        In Progress
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin1Dashboard;