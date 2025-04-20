import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Filter, X, ChevronRight, ArrowLeft, Search, User, Truck } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { set } from 'mongoose';

const OngoingTrips = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDriver, setFilterDriver] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
const [showRequestDetails, setShowRequestDetails] = useState(false);
  
  const navigate = useNavigate();

  //get token from local storage
    const token = localStorage.getItem('token');
  

  const handleBackToDashboard = (e) => {
    e.preventDefault();
    window.location.href = '/admin-dashboard';
  };

  useEffect(() => {
    const fetchTasks = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const response = await axios.get('http://localhost:5000/api/auth/today-requests', config);
            const data = response.data;

            // Log the full data to confirm structure
            console.log("Fetched tasks:", data);

            const newtasks = data.map(task => ({
                id: task._id,
                title: task.purpose,
                time: task.newtime,
                driver: task?.AssignedDriver?.name,
                user: task.full_name,
                from: task.textfrom,
                to: task.textto,
                status: task.status,
                details: task.purpose
            }));

            setTasks(newtasks);
            setFilteredTasks(newtasks);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    fetchTasks();
}, []);

  // Apply filters
  useEffect(() => {
    let result = tasks;
    
    if (searchTerm) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.user.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    setFilteredTasks(result);
  }, [searchTerm, filterDriver, filterUser, filterStatus, tasks]);

  const handleTaskClick = (taskId) => {
    navigate(`/admin-tracking-dashboard/${taskId}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDriver('');
    setFilterUser('');
    setFilterStatus('');
  };

  const getUniqueDrivers = () => {
    return [...new Set(tasks.map(task => task.driver))];
  };

  const getUniqueUsers = () => {
    return [...new Set(tasks.map(task => task.user))];
  };

  const getUniqueStatuses = () => {
    return [...new Set(tasks.map(task => task.status))];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500 pt-20 px-4">
        <div className="max-w-7xl mx-auto text-center py-8">
          <p>Loading Ongoing Trips...</p>
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
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-6 w-6 text-maroon-600" />
                    <h2 className="ml-2 text-xl font-bold text-ash-800">
                      Today's Ongoing Trips
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
                  </div>
                )}
                
                {filteredTasks.length === 0 ? (
                  <div className="text-center py-8 text-ash-500">
                    <p>No tasks found matching your filters</p>
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
                        onClick={() => handleTaskClick(task.id)}
                        className="flex items-center justify-between p-4 bg-ash-50 rounded-lg hover:bg-ash-100 cursor-pointer transition"
                      >
                        <div className="flex-1">
                          <p className="text-ash-800 text-sm">
                            {task.time}
                          </p>
                          <h3 className="text-ash-800 font-medium">
                            {task.title}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                            <p className="text-ash-600 flex items-center">
                              <Truck className="h-4 w-4 mr-1" />
                              {task.driver}
                            </p>
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
            
            {/* Task Details Section - Shows when a task is selected */}
            <div className="hidden lg:block">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 sticky top-6">
                <div className="text-center py-12 text-ash-500">
                  <p>Select a task to view details</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OngoingTrips;



// // Task Detail Page Component
// const TaskDetailPage = ({ taskId }) => {
//   const navigate = useNavigate();
//   const [task, setTask] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Mock data - replace with your actual data fetching logic
//   useEffect(() => {
//     const fetchTaskDetails = async () => {
//       try {
//         // Simulate API call
//         await new Promise(resolve => setTimeout(resolve, 500));
        
//         const mockTasks = {
//           '1': {
//             id: '1',
//             title: 'Delivery to Downtown',
//             time: '09:00 AM',
//             date: new Date().toLocaleDateString(),
//             driver: 'John Smith',
//             user: 'Acme Corp',
//             from: 'Warehouse A',
//             to: '123 Main St',
//             status: 'In Progress',
//             details: 'Deliver 5 packages of office supplies. Contact: Sarah (555-1234)',
//             notes: 'Customer requested delivery before 10am if possible.',
//             vehicle: 'Van #7 (License: ABC123)'
//           },
//           '2': {
//             id: '2',
//             title: 'Equipment Pickup',
//             time: '11:30 AM',
//             date: new Date().toLocaleDateString(),
//             driver: 'Maria Garcia',
//             user: 'Builders Inc',
//             from: 'Construction Site B',
//             to: 'Warehouse A',
//             status: 'Pending',
//             details: 'Pick up construction equipment. Supervisor: Mike (555-5678)',
//             notes: 'Need to bring forklift for heavy items.',
//             vehicle: 'Truck #3 (License: DEF456)'
//           },
//           '3': {
//             id: '3',
//             title: 'Client Meeting',
//             time: '02:15 PM',
//             date: new Date().toLocaleDateString(),
//             driver: 'John Smith',
//             user: 'Tech Solutions',
//             from: 'Office',
//             to: 'Tech Park',
//             status: 'Completed',
//             details: 'Discuss new project requirements. Bring presentation materials.',
//             notes: 'Client provided lunch meeting.',
//             vehicle: 'Company Car #1 (License: GHI789)'
//           },
//           '4': {
//             id: '4',
//             title: 'Urgent Document Delivery',
//             time: '04:45 PM',
//             date: new Date().toLocaleDateString(),
//             driver: 'Robert Chen',
//             user: 'Legal Associates',
//             from: 'Law Office',
//             to: 'Courthouse',
//             status: 'Pending',
//             details: 'Time-sensitive legal documents. Must arrive before 5pm.',
//             notes: 'Receiver will be waiting at security desk.',
//             vehicle: 'Motorcycle #2 (License: JKL012)'
//           }
//         };
        
//         setTask(mockTasks[taskId]);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching task details:', err);
//         setLoading(false);
//       }
//     };

//     if (taskId) {
//       fetchTaskDetails();
//     }
//   }, [taskId]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500 pt-20 px-4">
//         <div className="max-w-7xl mx-auto text-center py-8">
//           <p>Loading task details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!task) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500 pt-20 px-4">
//         <div className="max-w-7xl mx-auto text-center py-8">
//           <p>Task not found</p>
//           <button 
//             onClick={() => navigate(-1)}
//             className="mt-4 flex items-center justify-center mx-auto bg-maroon-600 text-white px-4 py-2 rounded-lg hover:bg-maroon-700"
//           >
//             <ArrowLeft className="h-5 w-5 mr-2" />
//             Back to tasks
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-maroon-700 via-ash-700 to-ash-500">
//       <main className="pt-20 px-4 md:px-8">
//         <div className="max-w-7xl mx-auto">
//           <button 
//             onClick={() => navigate(-1)}
//             className="flex items-center text-ash-100 hover:text-white mb-6"
//           >
//             <ArrowLeft className="h-5 w-5 mr-2" />
//             Back to tasks
//           </button>
          
//           <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6">
//             <div className="flex justify-between items-start mb-6">
//               <div>
//                 <h1 className="text-2xl font-bold text-ash-800">{task.title}</h1>
//                 <p className="text-ash-600 mt-1">
//                   {task.time} • {task.date}
//                 </p>
//               </div>
              
//               <span className={`px-3 py-1 text-sm rounded-full ${
//                 task.status === "Completed" ? "bg-green-100 text-green-700" :
//                 task.status === "In Progress" ? "bg-blue-100 text-blue-700" :
//                 "bg-maroon-100 text-maroon-700"
//               }`}>
//                 {task.status}
//               </span>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div>
//                 <h2 className="text-lg font-semibold text-ash-800 mb-4">Task Details</h2>
                
//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-sm font-medium text-ash-500">Route</h3>
//                     <p className="text-ash-800 mt-1">
//                       {task.from} → {task.to}
//                     </p>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-sm font-medium text-ash-500">Driver</h3>
//                     <p className="text-ash-800 mt-1">{task.driver}</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-sm font-medium text-ash-500">User</h3>
//                     <p className="text-ash-800 mt-1">{task.user}</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-sm font-medium text-ash-500">Vehicle</h3>
//                     <p className="text-ash-800 mt-1">{task.vehicle}</p>
//                   </div>
//                 </div>
//               </div>
              
//               <div>
//                 <h2 className="text-lg font-semibold text-ash-800 mb-4">Additional Information</h2>
                
//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-sm font-medium text-ash-500">Task Details</h3>
//                     <p className="text-ash-800 mt-1">{task.details}</p>
//                   </div>
                  
//                   <div>
//                     <h3 className="text-sm font-medium text-ash-500">Notes</h3>
//                     <p className="text-ash-800 mt-1">
//                       {task.notes || <span className="text-ash-400">No additional notes</span>}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

