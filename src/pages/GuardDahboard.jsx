import React from "react";
import { Calendar, Car } from "lucide-react";

function GuardDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500">
      {/* Main Content */}
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 min-h-screen  flex  flex-col justify-center items-center">
            {/* Ongoing Trips */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300 grid grid-cols-1 gap-4">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-maroon-600" />
                <h3 className="ml-2 text-xl font-bold text-maroon-700">
                  Scan QR Code
                </h3>
              </div>
              <p className="text-ash-600 mb-6">
                Scan the QR code to verify the vehicle.
              </p>
              <button className="w-full bg-maroon-700 text-white px-6 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                Scan QR Code
              </button>
            </div>

            {/* request vehicles */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 hover:transform hover:-translate-y-2 transition duration-300 grid grid-cols-1 gap-4">
              <div className="flex items-center mb-4">
                <Car className="h-6 w-6 text-red-600" />
                <h3 className="ml-2 text-xl font-bold text-maroon-700">
                  Request Vehicles
                </h3>
              </div>
              <p className="text-ash-600 mb-6">
                Request for vehicles for official duties.
              </p>
              <button className="w-full bg-maroon-700 text-white px-6 py-2 rounded-md hover:bg-maroon-600 transition duration-300">
                Request vehicle
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GuardDashboard;
