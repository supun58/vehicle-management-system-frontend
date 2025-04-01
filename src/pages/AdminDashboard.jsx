import React from "react";
import {
  Car,
  Calendar,
  MessageSquare,
  Users,
  PlusCircle,
  X,
} from "lucide-react";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500">
      {/* Main Content */}
      <main className="pt-16 pb-12">
        <div className="container mx-auto px-4 py-6">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-ash-200">Manage your transportation system efficiently</p>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 max-w-7xl mx-auto">
            {/* Add Vehicle */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 hover:transform hover:-translate-y-1 transition duration-300 w-full max-w-sm mx-auto">
              <div className="flex items-center mb-3">
                <PlusCircle className="h-6 w-5 text-green-600" />
                <h3 className="ml-2 text-base font-bold text-maroon-700">Add Vehicle</h3>
              </div>
              <p className="text-ash-600 mb-3 text-sm">
                Add new vehicles to the fleet for official purposes.
              </p>
              <button className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300 text-xs">
                Add Vehicle
              </button>
            </div>

            {/* View/Remove Vehicles */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 hover:transform hover:-translate-y-1 transition duration-300 w-full max-w-sm mx-auto">
              <div className="flex items-center mb-3">
                <Car className="h-6 w-5 text-blue-600" />
                <h3 className="ml-2 text-base font-bold text-maroon-700">Manage Vehicles</h3>
              </div>
              <p className="text-ash-600 mb-3 text-sm">
                View, edit, or remove vehicles from the system.
              </p>
              <button className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300 text-xs">
                Manage Vehicles
              </button>
            </div>

            {/* Ongoing Trips */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 hover:transform hover:-translate-y-1 transition duration-300 w-full max-w-sm mx-auto">
              <div className="flex items-center mb-3">
                <Calendar className="h-6 w-5 text-maroon-600" />
                <h3 className="ml-2 text-base font-bold text-maroon-700">Ongoing Trips</h3>
              </div>
              <p className="text-ash-600 mb-3 text-sm">
                Track and manage ongoing trips in real-time.
              </p>
              <button className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300 text-xs">
                View Trips
              </button>
            </div>

            {/* Messages */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 hover:transform hover:-translate-y-1 transition duration-300 w-full max-w-sm mx-auto">
              <div className="flex items-center mb-3">
                <MessageSquare className="h-6 w-5 text-purple-600" />
                <h3 className="ml-2 text-base font-bold text-maroon-700">Messages</h3>
              </div>
              <p className="text-ash-600 mb-3 text-sm">
                View messages/notifications from the system/users.
              </p>
              <button className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300 text-xs">
                View Messages
              </button>
            </div>

            {/* User Management */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 hover:transform hover:-translate-y-1 transition duration-300 w-full max-w-sm mx-auto">
              <div className="flex items-center mb-3">
                <Users className="h-6 w-5 text-red-600" />
                <h3 className="ml-2 text-base font-bold text-maroon-700">User Management</h3>
              </div>
              <p className="text-ash-600 mb-3 text-sm">
                Handle user accounts, permissions & access levels.
              </p>
              <button 
                onClick={() => {
                  window.location.href = "/user-management";
                }}
                className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300 text-xs">
                Manage Users
              </button>
            </div>

            {/* pending requests */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 hover:transform hover:-translate-y-1 transition duration-300 w-full max-w-sm mx-auto">
              <div className="flex items-center mb-3">
                <X className="h-6 w-5 text-red-600" />
                <h3 className="ml-2 text-base font-bold text-maroon-700">Pending Requests</h3>
              </div>
              <p className="text-ash-600 mb-3 text-sm">
                Analyze and approve pending requests from users.
              </p>
              <button 
                onClick={() => {
                  window.location.href = "/pending-requests";
                }}
                className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300 text-xs">
                Pending Requests
              </button>
            </div>
          </div>

{/* Centered Last Tile - Outside the grid */}
<div className="flex justify-center">
  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-4 hover:transform hover:-translate-y-1 transition duration-300 w-full max-w-sm mx-auto">
    {/* Removed border and changed to standard white background */}
    <div className="flex items-center mb-3">
      <div className="p-1.5 rounded-lg bg-maroon-100/30">
        {/* Changed bg-ash-100/50 to bg-maroon-100/30 */}
        <Calendar className="h-6 w-5 text-maroon-600" />
        {/* Changed text-ash-600 to text-maroon-600 */}
      </div>
      <h3 className="ml-2 text-base font-bold text-maroon-700">Past Trip History</h3>
      {/* Changed text-ash-700 to text-maroon-700 */}
    </div>
    <p className="text-ash-600 mb-3 text-sm">
      Complete records of past trips & logs.
    </p>
    <button className="w-full bg-maroon-700 text-white px-4 py-2 rounded-md hover:bg-maroon-600 transition duration-300 text-xs">
      {/* Changed bg-ash-600 to bg-maroon-700 and rounded-lg to rounded-md */}
      View History
    </button>
  </div>
</div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;