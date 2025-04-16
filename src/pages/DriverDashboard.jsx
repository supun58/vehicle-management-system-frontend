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
  ChevronRight,
  Filter,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TaskDetails from "./Driver-Dashboard/TaskDetails";

function DriverDashboard() {
  const [messages, setMessages] = useState([]);

    const [schedules, setSchedules] = useState([]);
    const [filteredSchedules, setFilteredSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterDate, setFilterDate] = useState(new Date());
    const [filterType, setFilterType] = useState("today");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const navigate = useNavigate();

    const userData = localStorage.getItem('userData');
    const id = userData ? JSON.parse(userData)._id : '';

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

    // Fetch schedules from backend
    useEffect(() => {
      const fetchSchedules = async () => {
        try {
          setLoading(true);
          // Replace ':id' with the actual driver ID (from auth context or params)
          const response = await fetch(`http://localhost:5000/api/auth/driver-schedules/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          
          if (!response.ok) {
            throw new Error("Failed to fetch schedules");
          }
          
          const data = await response.json();
          setSchedules(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
          console.error("Error fetching schedules:", err);
        }
      };
  
      fetchSchedules();
    }, []);
  
    // Filter schedules based on selected date/filter
    useEffect(() => {
      if (!schedules.length) return;
  
      const filterSchedules = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
  
        let filtered = [];
  
        switch (filterType) {
          case "today":
            filtered = schedules.filter(schedule => {
              const scheduleDate = new Date(schedule.date);
              return scheduleDate.toDateString() === today.toDateString();
            });
            break;
          case "tomorrow":
            filtered = schedules.filter(schedule => {
              const scheduleDate = new Date(schedule.date);
              return scheduleDate.toDateString() === tomorrow.toDateString();
            });
            break;
          case "custom":
            filtered = schedules.filter(schedule => {
              const scheduleDate = new Date(schedule.date);
              return scheduleDate.toDateString() === filterDate.toDateString();
            });
            break;
          default:
            filtered = schedules;
        }
  
        // Sort by time
        filtered.sort((a, b) => {
          const timeA = new Date(`1970-01-01T${a.newtime}`);
          const timeB = new Date(`1970-01-01T${b.newtime}`);
          return timeA - timeB;
        });
  
        // Add status based on current time
        const now = new Date();
        filtered = filtered.map(schedule => {
          const scheduleDateTime = new Date(`${schedule.date}T${schedule.newtime}`);
          const status = 
            scheduleDateTime < now ? "Completed" :
            scheduleDateTime > new Date(now.getTime() + 30 * 60000) ? "Upcoming" : "In Progress";
          
          return { ...schedule, status };
        });
  
        setFilteredSchedules(filtered);
      };
  
      filterSchedules();
    }, [schedules, filterDate, filterType]);
  
    const handleTaskClick = (taskId) => {
      navigate(`/task-details/${taskId}`);
    };
  
    const handleDateChange = (date) => {
      setFilterDate(date);
      setFilterType("custom");
      setShowDatePicker(false);
    };
  
    const clearFilter = () => {
      setFilterType("today");
      setFilterDate(new Date());
    };
  

  // const schedules = [
  //   {
  //     time: "08:00 AM",
  //     task: "Morning Pickup - Faculty of Engineering",
  //     status: "Pending",
  //   },
  //   {
  //     time: "11:30 AM",
  //     task: "Official Transport - Dean's Office",
  //     status: "Upcoming",
  //   },
  //   {
  //     time: "02:00 PM",
  //     task: "Student Field Visit - Galle Fort",
  //     status: "Upcoming",
  //   },
  // ];

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Schedule Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-6 w-6 text-maroon-600" />
                    <h2 className="ml-2 text-xl font-bold text-ash-800">
                      {filterType === "today" && "Today's Schedule"}
                      {filterType === "tomorrow" && "Tomorrow's Schedule"}
                      {filterType === "custom" && `Schedule for ${filterDate.toLocaleDateString()}`}
                    </h2>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center gap-2 bg-ash-100 hover:bg-ash-200 px-3 py-1 rounded-lg text-sm"
                    >
                      <Filter size={16} />
                      Filter
                    </button>
                    
                    {showDatePicker && (
                      <div className="absolute right-0 mt-2 bg-white p-4 rounded-lg shadow-xl z-10">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Filter Schedule</h3>
                          <button onClick={() => setShowDatePicker(false)}>
                            <X size={18} />
                          </button>
                        </div>
                      
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              setFilterType("today");
                              setShowDatePicker(false);
                            }}
                            className={`w-full text-left px-3 py-1 rounded ${filterType === "today" ? "bg-maroon-100 text-maroon-700" : "hover:bg-ash-100"}`}
                          >
                            Today
                          </button>
                          
                          <button
                            onClick={() => {
                              setFilterType("tomorrow");
                              setShowDatePicker(false);
                            }}
                            className={`w-full text-left px-3 py-1 rounded ${filterType === "tomorrow" ? "bg-maroon-100 text-maroon-700" : "hover:bg-ash-100"}`}
                          >
                            Tomorrow
                          </button>
                          
                          <div className="pt-2 border-t">
                            <label className="block text-sm mb-1">Custom Date:</label>
                            <DatePicker
                              selected={filterDate}
                              onChange={handleDateChange}
                              className="border rounded px-2 py-1 text-sm w-full"
                              minDate={new Date()}
                            />
                          </div>
                        </div>
                        
                        {filterType === "custom" && (
                          <button
                            onClick={clearFilter}
                            className="mt-2 text-sm text-maroon-600 hover:text-maroon-800"
                          >
                            Clear filter
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <p>Loading schedules...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <p>Error loading schedules: {error}</p>
                  </div>
                ) : filteredSchedules.length === 0 ? (
                  <div className="text-center py-8 text-ash-500">
                    <p>No schedules found for selected date</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSchedules.map((schedule, index) => (
                      <div
                        key={schedule._id || index}
                        onClick={() => handleTaskClick(schedule._id)}
                        className="flex items-center justify-between p-4 bg-ash-50 rounded-lg hover:bg-ash-100 cursor-pointer transition"
                      >
                        <div className="flex-1">
                          <p className="text-ash-800 text-sm">
                            {schedule.newtime} • {new Date(schedule.date).toLocaleDateString()}
                          </p>
                          {schedule.textfrom && (
                            <p className="text-ash-800 font-medium flex items-center">
                              <Navigation className="h-4 w-4 mr-1" />
                              {schedule.textfrom} to {schedule.textto}
                            </p>
                          )}
                          <p className="text-ash-600 text-sm mt-1 flex items-center">
                            {schedule.task || schedule.purpose}
                          </p>

                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            schedule.status === "Completed" ? "bg-green-100 text-green-700" :
                            schedule.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                            "bg-maroon-100 text-maroon-700"
                          }`}>
                            {schedule.status}
                          </span>
                          <ChevronRight className="h-5 w-5 ml-2 text-ash-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
