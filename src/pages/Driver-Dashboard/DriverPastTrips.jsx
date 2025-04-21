import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar as CalendarIcon, Filter, X, ChevronRight, ArrowLeft, Search, User, Truck, MapPin, Clock, Car, FileText, Mail, Phone, Users, Navigation, CheckCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, subDays, isWithinInterval } from 'date-fns';

const DriverPastTrips = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDriver, setFilterDriver] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedTask, setSelectedTask] = useState(null);
  const navigate = useNavigate();

  // Get token from local storage
  const token = localStorage.getItem('token');

  const getUserid = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData)._id : '';
  };
  console.log('User ID:', getUserid());

  const handleBackToDashboard = (e) => {
    e.preventDefault();
    navigate('/driver-dashboard');
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get('https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/past-requests', config);
        const data = response.data;

        // Filter tasks to only include those assigned to the current driver
        const driverId = getUserid();
        console.log('Driver ID:', driverId); // Debugging line
        const driverTasks = data.filter(task => 
          task.AssignedDriver && task.AssignedDriver.id === driverId
        );

        const newTasks = driverTasks.map(task => ({
          id: task._id,
          title: task.purpose,
          time: task.newtime,
          date: new Date(task.createdAt),
          driver: task?.AssignedDriver?.name,
          driverDetails: task.AssignedDriver,
          user: task.full_name,
          email: task.email,
          role: task.role,
          contact: task.contact,
          vehicleType: task.vehicleType,
          purpose: task.purpose,
          requestDate: task.date,
          from: task.textfrom,
          to: task.textto,
          fromCoords: task.from,
          toCoords: task.to,
          distance: task.distance,
          actualDistance: task.actualdistance,
          status: task.status,
          adminComments: task.adminComments,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          request_type: task.request_type,
          approvedBy: task.approvedBy,
          path: task.path,
          triptime: task.triptime,
          completedAt: task.completedAt
        }));

        setTasks(newTasks);
        setFilteredTasks(newTasks);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  // Apply filters
  useEffect(() => {
    let result = tasks;
    
    if (searchTerm) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.driver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.user?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterDriver) {
      result = result.filter(task => task.driver === filterDriver);
    }
    
    if (filterUser) {
      result = result.filter(task => task.user === filterUser);
    }
    
    if (filterStatus) {
      result = result.filter(task => task.status === filterStatus);
    }
    
    // Date range filter
    if (startDate && endDate) {
      result = result.filter(task => {
        const taskDate = new Date(task.date);
        return isWithinInterval(taskDate, {
          start: startDate,
          end: endDate
        });
      });
    }
    
    setFilteredTasks(result);
  }, [searchTerm, filterDriver, filterUser, filterStatus, tasks, startDate, endDate]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDriver('');
    setFilterUser('');
    setFilterStatus('');
    setDateRange([null, null]);
  };

  const getUniqueDrivers = () => {
    return [...new Set(tasks.map(task => task.driver))].filter(Boolean);
  };

  const getUniqueUsers = () => {
    return [...new Set(tasks.map(task => task.user))].filter(Boolean);
  };

  const getUniqueStatuses = () => {
    return [...new Set(tasks.map(task => task.status))].filter(Boolean);
  };

  const formatCoordinates = (location) => {
    if (!location?.coordinates) return 'Location not specified';
    try {
      const [longitude, latitude] = location.coordinates;
      return `${latitude?.toFixed(6) || 'N/A'}, ${longitude?.toFixed(6) || 'N/A'}`;
    } catch (error) {
      console.error('Error formatting coordinates:', error);
      return 'Invalid coordinates';
    }
  };

  const openMapWithCoordinates = (location) => {
    try {
      if (!location?.coordinates) {
        console.error('Invalid location data');
        return;
      }
      const [longitude, latitude] = location.coordinates;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening map:', error);
    }
  };

  const getDirections = () => {
    if (!selectedTask) return;
    try {
      if (!selectedTask.fromCoords?.coordinates || !selectedTask.toCoords?.coordinates) {
        console.error('Missing coordinates for directions');
        return;
      }
      const [fromLng, fromLat] = selectedTask.fromCoords.coordinates;
      const [toLng, toLat] = selectedTask.toCoords.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=driving`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error getting directions:', error);
    }
  };

  const quickDateOptions = [
    { label: 'Today', value: [new Date(), new Date()] },
    { label: 'Yesterday', value: [subDays(new Date(), 1), subDays(new Date(), 1)] },
    { label: 'Last 7 Days', value: [subDays(new Date(), 7), new Date()] },
    { label: 'Last 30 Days', value: [subDays(new Date(), 30), new Date()] },
    { label: 'All Time', value: [null, null] }
  ];

  const renderTaskDetails = () => {
    if (!selectedTask) return null;

    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 sticky top-6 h-fit">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-ash-800">Trip Details</h2>
          <button 
            onClick={() => setSelectedTask(null)}
            className="text-ash-500 hover:text-ash-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Requester Information */}
        <div className="bg-ash-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-maroon-600 mb-2">Requester Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">Name</p>
                <p className="font-medium">{selectedTask.user}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">Email</p>
                <p className="font-medium">{selectedTask.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">Contact</p>
                <p className="font-medium">{selectedTask.contact}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">Role</p>
                <p className="font-medium">{selectedTask.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-ash-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-maroon-600 mb-2">Vehicle Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">Vehicle Type</p>
                <p className="font-medium">{selectedTask.vehicleType}</p>
              </div>
            </div>
            {selectedTask.driverDetails && (
              <>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-maroon-600" />
                  <div>
                    <p className="text-sm text-ash-600">Driver</p>
                    <p className="font-medium">{selectedTask.driverDetails.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-maroon-600" />
                  <div>
                    <p className="text-sm text-ash-600">Driver Contact</p>
                    <p className="font-medium">{selectedTask.driverDetails.contact}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-maroon-600" />
                  <div>
                    <p className="text-sm text-ash-600">Vehicle Number</p>
                    <p className="font-medium">{selectedTask.driverDetails.vehicle}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-ash-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-maroon-600 mb-2">Trip Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">Purpose</p>
                <p className="font-medium">{selectedTask.purpose}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">Request Date</p>
                <p className="font-medium">{format(new Date(selectedTask.requestDate), 'MMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">Time</p>
                <p className="font-medium">{selectedTask.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">Trip Duration</p>
                <p className="font-medium">{selectedTask.triptime} minutes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">From</p>
                <div 
                  className="font-medium cursor-pointer text-blue-600 hover:underline"
                  onClick={() => openMapWithCoordinates(selectedTask.fromCoords)}
                >
                  {selectedTask.from} ({formatCoordinates(selectedTask.fromCoords)})
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">To</p>
                <div 
                  className="font-medium cursor-pointer text-blue-600 hover:underline"
                  onClick={() => openMapWithCoordinates(selectedTask.toCoords)}
                >
                  {selectedTask.to} ({formatCoordinates(selectedTask.toCoords)})
                </div>
              </div>
            </div>
            <button
              onClick={getDirections}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-maroon-600 text-white rounded-lg hover:bg-maroon-700 transition-colors mt-2"
            >
              <Navigation className="h-4 w-4" />
              <span>Get Directions</span>
            </button>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">Distance</p>
                <p className="font-medium">
                  {selectedTask.actualDistance ? `${selectedTask.actualDistance} km (actual)` : `${selectedTask.distance} km (estimated)`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="bg-ash-50 rounded-lg p-4">
          <h3 className="font-semibold text-maroon-600 mb-2">Status Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-ash-600">Status</p>
                <p className="font-medium">{selectedTask.status}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-maroon-600" />
              <div>
                <p className="text-sm text-ash-600">Completed At</p>
                <p className="font-medium">
                  {selectedTask.completedAt ? format(new Date(selectedTask.completedAt), 'MMM d, yyyy h:mm a') : 'N/A'}
                </p>
              </div>
            </div>
            {selectedTask.approvedBy && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-maroon-600" />
                <div>
                  <p className="text-sm text-ash-600">Approved By</p>
                  <p className="font-medium">{selectedTask.approvedBy.name}</p>
                </div>
              </div>
            )}
            {selectedTask.adminComments && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-maroon-600 mt-1" />
                <div>
                  <p className="text-sm text-ash-600">Admin Comments</p>
                  <p className="font-medium">{selectedTask.adminComments}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500 pt-20 px-4">
        <div className="max-w-7xl mx-auto text-center py-8">
          <p>Loading Past Trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500 pt-20 px-4">
        <div className="max-w-7xl mx-auto text-center py-8 text-red-500">
          <p>Error loading tasks: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500">
      <main className="pt-20 px-4 md:px-8">
        <button 
          onClick={handleBackToDashboard}
          className="flex items-center text-white mb-6 hover:text-[#de9e28] transition duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="max-w-7xl mx-auto grid gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Main Tasks Section */}
            <div className={`${selectedTask ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <CalendarIcon className="h-6 w-6 text-maroon-600" />
                    <h2 className="ml-2 text-xl font-bold text-ash-800">
                      Completed Trips
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-3 py-1 border rounded-lg text-sm"
                      />
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ash-400" />
                    </div>
                    
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 bg-ash-100 hover:bg-ash-200 px-3 py-1 rounded-lg text-sm"
                    >
                      <Filter size={16} />
                      Filters
                    </button>
                  </div>
                </div>
                
                {showFilters && (
                  <div className="bg-ash-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Filter Tasks</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={clearFilters}
                          className="text-sm text-maroon-600 hover:text-maroon-800"
                        >
                          Clear all
                        </button>
                        <button onClick={() => setShowFilters(false)}>
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Driver</label>
                        <select
                          value={filterDriver}
                          onChange={(e) => setFilterDriver(e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        >
                          <option value="">All Drivers</option>
                          {getUniqueDrivers().map(driver => (
                            <option key={driver} value={driver}>{driver}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">User</label>
                        <select
                          value={filterUser}
                          onChange={(e) => setFilterUser(e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        >
                          <option value="">All Users</option>
                          {getUniqueUsers().map(user => (
                            <option key={user} value={user}>{user}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full border rounded px-2 py-1 text-sm"
                        >
                          <option value="">All Statuses</option>
                          {getUniqueStatuses().map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Date Range Picker */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Date Range</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                          <DatePicker
                            selectsRange={true}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => {
                              setDateRange(update);
                            }}
                            isClearable={true}
                            placeholderText="Select date range"
                            className="w-full pl-8 pr-3 py-1 border rounded-lg text-sm"
                            dateFormat="MMM d, yyyy"
                          />
                          <CalendarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ash-400" />
                        </div>
                      </div>
                      
                      {/* Quick date selection buttons */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {quickDateOptions.map((option) => (
                          <button
                            key={option.label}
                            onClick={() => setDateRange(option.value)}
                            className={`text-xs px-2 py-1 rounded ${
                              (!startDate && !option.value[0]) || 
                              (startDate?.toDateString() === option.value[0]?.toDateString() && 
                               endDate?.toDateString() === option.value[1]?.toDateString())
                              ? 'bg-maroon-600 text-white'
                              : 'bg-ash-100 hover:bg-ash-200'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Date range display */}
                {startDate && endDate && (
                  <div className="mb-4 text-sm text-maroon-700 bg-maroon-50 px-3 py-2 rounded-lg inline-flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
                    <button 
                      onClick={() => setDateRange([null, null])}
                      className="ml-2 text-maroon-900 hover:text-maroon-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8 text-ash-500">
                    <p>No trips found matching your filters</p>
                    <button 
                      onClick={clearFilters}
                      className="mt-2 text-sm text-maroon-600 hover:text-maroon-800"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className={`flex items-center justify-between p-4 rounded-lg hover:bg-ash-100 cursor-pointer transition ${
                          selectedTask?.id === task.id ? 'bg-maroon-50 border border-maroon-200' : 'bg-ash-50'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-ash-800 text-sm">
                              {task.time}
                            </p>
                            <p className="text-ash-600 text-xs">
                              {format(new Date(task.requestDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <h3 className="text-ash-800 font-medium mt-1">
                            {task.title}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                            {task.driver && (
                              <p className="text-ash-600 flex items-center">
                                <Truck className="h-4 w-4 mr-1" />
                                {task.driver}
                              </p>
                            )}
                            <p className="text-ash-600 flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {task.user}
                            </p>
                            <p className="text-ash-600">
                              {task.from} → {task.to}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            task.status === "Completed" ? "bg-green-100 text-green-700" :
                            task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                            "bg-maroon-100 text-maroon-700"
                          }`}>
                            {task.status}
                          </span>
                          <ChevronRight className="h-5 w-5 ml-2 text-ash-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Task Details Section */}
            {selectedTask && renderTaskDetails()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DriverPastTrips;