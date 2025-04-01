import React from "react";
import {
  Car,
  AlertTriangle,
  Calendar,
  Clock,
  MessageSquare,
  Navigation,
} from "lucide-react";

function DriverDashboard() {
  const schedules = [
    {
      time: "08:00 AM",
      task: "Morning Pickup - Faculty of Engineering",
      status: "Pending",
    },
    {
      time: "11:30 AM",
      task: "Official Transport - Dean's Office",
      status: "Upcoming",
    },
    {
      time: "02:00 PM",
      task: "Student Field Visit - Galle Fort",
      status: "Upcoming",
    },
  ];

  const messages = [
    {
      sender: "Transport Office",
      message: "Please confirm your availability for tomorrow's special event.",
      time: "10 mins ago",
    },
    {
      sender: "Maintenance Dept",
      message: "Vehicle service scheduled for next week.",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500">
      {/* Main Content */}
      <main className="pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid gap-6">

          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Driver Dashboard</h1>
            <p className="text-ash-200">Manage your transportation system efficiently</p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Start Day Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-ash-800">Start Day</h3>
                <Clock className="h-6 w-6 text-maroon-600" />
              </div>
              <button className="w-full bg-maroon-700 hover:bg-maroon-800  text-white px-4 py-2 rounded-lg transition duration-300">
                Start
              </button>
            </div>

            {/* End Day Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-ash-800">End Day</h3>
                <Clock className="h-6 w-6 text-maroon-600" />
              </div>
              <button className="w-full bg-maroon-700 hover:bg-maroon-800  text-white px-4 py-2 rounded-lg transition duration-300">
                End
              </button>
            </div>

            {/* Emergency Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-ash-800">Emergency</h3>
                <AlertTriangle className="h-6 w-6 text-maroon-600" />
              </div>
              <button className="w-full bg-maroon-700 hover:bg-maroon-800  text-white px-4 py-2 rounded-lg transition duration-300">
                Report
              </button>
            </div>

            {/* Official Page Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-ash-800">
                  Official Tour
                </h3>
                <Calendar className="h-6 w-6 text-maroon-600" />
              </div>
              <button className="w-full bg-maroon-700 hover:bg-maroon-800 text-white px-4 py-2 rounded-lg transition duration-300">
                View
              </button>
            </div>
          </div>

          {/* Schedule and Messages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Schedule Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
                <div className="flex items-center mb-6">
                  <Calendar className="h-6 w-6 text-maroon-600" />
                  <h2 className="ml-2 text-xl font-bold text-ash-800">
                    Today's Schedule
                  </h2>
                </div>
                <div className="space-y-4">
                  {schedules.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-ash-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-ash-600 text-sm">{schedule.time}</p>
                        <p className="text-ash-800 font-medium">
                          {schedule.task}
                        </p>
                      </div>
                      <span className="px-3 py-1 text-sm rounded-full bg-maroon-100 text-maroon-700">
                        {schedule.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Messages Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
                <div className="flex items-center mb-6">
                  <MessageSquare className="h-6 w-6 text-maroon-600" />
                  <h2 className="ml-2 text-xl font-bold text-ash-800">
                    Messages
                  </h2>
                </div>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className="p-4 bg-ash-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-maroon-700">
                          {message.sender}
                        </h3>
                        <span className="text-xs text-ash-500">
                          {message.time}
                        </span>
                      </div>
                      <p className="text-ash-600 text-sm">{message.message}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 bg-maroon-700 text-white px-4 py-2 rounded-lg hover:bg-maroon-600 transition duration-300">
                  View All Messages
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DriverDashboard;
