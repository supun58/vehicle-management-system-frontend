import React from "react";
import {
  Car,
  Calendar,
  MessageSquare,
  Trash,
  PlusCircle,
  X,
} from "lucide-react";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500">
      {/* Main Content */}
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Add Vehicle */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300">
              <div className="flex items-center mb-4">
                <PlusCircle className="h-6 w-6 text-green-600" />
                <h3 className="ml-2 text-xl font-bold text-maroon-700">
                  Add Vehicle
                </h3>
              </div>
              <p className="text-ash-600 mb-6">
                Add new vehicles to the fleet for official purposes.
              </p>
              <button className="w-full bg-maroon-700 text-white px-6 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                Add Vehicle
              </button>
            </div>

            {/* View/Remove Vehicles */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300">
              <div className="flex items-center mb-4">
                <Car className="h-6 w-6 text-blue-600" />
                <h3 className="ml-2 text-xl font-bold text-maroon-700">
                  Manage Vehicles
                </h3>
              </div>
              <p className="text-ash-600 mb-6">
                View, edit, or remove vehicles from the system.
              </p>
              <button className="w-full bg-maroon-700 text-white px-6 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                Manage Vehicles
              </button>
            </div>

            {/* Ongoing Trips */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-maroon-600" />
                <h3 className="ml-2 text-xl font-bold text-maroon-700">
                  Ongoing Trips
                </h3>
              </div>
              <p className="text-ash-600 mb-6">
                Track and manage ongoing trips in real-time.
              </p>
              <button className="w-full bg-maroon-700 text-white px-6 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                View Trips
              </button>
            </div>

            {/* Messages */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300">
              <div className="flex items-center mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
                <h3 className="ml-2 text-xl font-bold text-maroon-700">
                  Messages
                </h3>
              </div>
              <p className="text-ash-600 mb-6">
                View messages or notifications from the system or users.
              </p>
              <button className="w-full bg-maroon-700 text-white px-6 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                View Messages
              </button>
            </div>

            {/* Remove Users */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300">
              <div className="flex items-center mb-4">
                <Trash className="h-6 w-6 text-red-600" />
                <h3 className="ml-2 text-xl font-bold text-maroon-700">
                  Remove Users
                </h3>
              </div>
              <p className="text-ash-600 mb-6">
                Remove inactive or unauthorized users from the system.
              </p>
              <button className="w-full bg-maroon-700 text-white px-6 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                Remove Users
              </button>
            </div>
            {/* pending requests */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300">
              <div className="flex items-center mb-4">
                <X className="h-6 w-6 text-red-600" />
                <h3 className="ml-2 text-xl font-bold text-maroon-700">
                  Pending Requests
                </h3>
              </div>
              <p className="text-ash-600 mb-6">
                Analyze and approve pending requests from users.
              </p>
              <button className="w-full bg-maroon-700 text-white px-6 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                Pending Requests
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
