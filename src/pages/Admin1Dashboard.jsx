import React from "react";
import { Calendar, MessageSquare, X } from "lucide-react";

function Admin1Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500">
      {/* Main Content */}
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin1Dashboard;
