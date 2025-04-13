import React, { useEffect, useState } from "react";
import axios from "axios";
const DRIVER_ID = localStorage.getItem("driverId");

import {
  Car,
  AlertTriangle,
  Calendar,
  Clock,
  MessageSquare,
  Navigation,
  Mail,
} from "lucide-react";

function DriverDashboard() {
  const [messages, setMessages] = useState([]);

  console.log("Driver ID:", DRIVER_ID);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!DRIVER_ID || DRIVER_ID === "null") {
          console.warn("Driver ID is not available");
          return;
        }
        const res = await axios.get(
          `http://localhost:5000/api/auth/messages/driver/${DRIVER_ID}`
        );
        setMessages(res.data);
        console.log("Messages fetched successfully", res.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, [DRIVER_ID]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500">
      <main className="pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid gap-6">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Driver Dashboard
            </h1>
            <p className="text-ash-200">
              Manage your transportation system efficiently
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Start Day */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-ash-800">Start Day</h3>
                <Clock className="h-6 w-6 text-maroon-600" />
              </div>
              <button className="w-full bg-maroon-700 hover:bg-maroon-800  text-white px-4 py-2 rounded-lg transition duration-300">
                Start
              </button>
            </div>

            {/* End Day */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-ash-800">End Day</h3>
                <Clock className="h-6 w-6 text-maroon-600" />
              </div>
              <button className="w-full bg-maroon-700 hover:bg-maroon-800  text-white px-4 py-2 rounded-lg transition duration-300">
                End
              </button>
            </div>

            {/* Emergency */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-ash-800">Emergency</h3>
                <AlertTriangle className="h-6 w-6 text-maroon-600" />
              </div>
              <a href="/emergency-report">
                <button className="w-full bg-maroon-700 hover:bg-maroon-800  text-white px-4 py-2 rounded-lg transition duration-300">
                  Report
                </button>
              </a>
            </div>

            {/* Official Tour */}
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

          {/* Schedule and Message Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Schedule Section */}
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

            {/* Message Box Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-6 w-6 text-maroon-600" />
                <h2 className="ml-2 text-xl font-bold text-ash-800">
                  Message Box
                </h2>
              </div>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-ash-600">No messages available</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className="p-4 bg-ash-50 rounded-lg shadow-sm"
                    >
                      <h3 className="font-semibold text-maroon-800">
                        {msg.title}
                      </h3>
                      <p className="text-ash-700 text-sm">{msg.body}</p>
                      <p className="text-xs text-ash-400 mt-1">
                        {new Date(msg.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DriverDashboard;
