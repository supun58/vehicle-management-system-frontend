import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  AlertCircle, 
  Edit2, 
  Trash2,
  User,
  Clock
} from 'lucide-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { useAuth } from '../../controllers/authcontext';
import RequestDetails from './RequestDetails';


function PendingRequests() {
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const { token, logout, user } = useAuth();

  // Loading states
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [vehicleRequests, setVehicleRequests] = useState([]);
  const [gatePassRequests, setGatePassRequests] = useState([]);
  const [approvedVehicleRequests, setApprovedVehicleRequests] = useState([]);
  const [approvedGatePassRequests, setApprovedGatePassRequests] = useState([]);
  const [rejectedVehicleRequests, setRejectedVehicleRequests] = useState([]);
  const [rejectedGatePassRequests, setRejectedGatePassRequests] = useState([]);

  const userData = localStorage.getItem('userData');
  const name = userData ? JSON.parse(userData).full_name : '';


      const [showDriverModal, setShowDriverModal] = useState(false);
      const [selectedDriver, setSelectedDriver] = useState(null);

  // Filter vehicle requests based on distance and user role
  const filterVehicleRequests = (requests) => {
    if (!user) return [];
    
    // Admin can see all vehicle requests
    if (user.account_status === 'Admin') {
      return requests;
    }
    // Faculty Admin can see all but only interact with <=10km
    else if (user.account_status === 'Faculty Admin') {
      return requests.filter(request => request.request_type === 'VehicleRequest');
    }
    return [];
  };

 // Get available drivers from API call
const [availableDrivers, setAvailableDrivers] = useState([]);
const [driversLoading, setDriversLoading] = useState(false);

const getAvailableDrivers = async () => {
  setDriversLoading(true);
  try {
    const response = await axios.get('http://localhost:5000/api/auth/getdrivers', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Transform driver data to match expected format
    const drivers = response.data.map(driver => ({
      id: driver._id,
      name: driver.full_name,
      license: driver.role_details?.driver?.licenseNumber,
      vehicle: driver.role_details?.driver?.vehicleAssigned,
      contact: driver.phone
    }));

    setAvailableDrivers(drivers);
    return drivers;

  } catch (error) {
    console.error("Error fetching available drivers:", error);
    setAvailableDrivers([]);
    return [];
  } finally {
    setDriversLoading(false);
  }
};

// Fetch drivers when component mounts
useEffect(() => {
  if (token) {
    getAvailableDrivers();
  }
}, [token]);

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        if (!token) {
          console.error("No token available");
          logout();
          return;
        }

        setIsLoading(true);
        
        // Fetch both gate pass and vehicle requests in parallel
        const [gatePassResponse, vehicleResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/auth/pending-requests', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/auth/vehicle-requests', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Process gate pass data (unchanged)
        const gatePassData = gatePassResponse.data;
        
        // Process vehicle data with consistent request_type
        const vehicleData = vehicleResponse.data.map(request => ({
          ...request,
          request_type: 'VehicleRequest'
        }));

        // Filter vehicle requests based on user role
        const filteredVehicleRequests = filterVehicleRequests(vehicleData);

        // Set all states
        setGatePassRequests(gatePassData.filter(r => r.status === 'Pending'));
        setApprovedGatePassRequests(gatePassData.filter(r => r.status === 'Approved'));
        setRejectedGatePassRequests(gatePassData.filter(r => r.status === 'Rejected'));
        
        setVehicleRequests(filteredVehicleRequests.filter(r => r.status === 'Pending' || r.status === 'FacultyApproved'));
        setApprovedVehicleRequests(filteredVehicleRequests.filter(r => r.status === 'Approved'));
        setRejectedVehicleRequests(filteredVehicleRequests.filter(r => r.status === 'Rejected'));

      } catch (error) {
        console.error("Error fetching requests:", error);
        if (error.response?.status === 401) {
          logout();
          window.location.href = '/';
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllRequests();
  }, [token, user, logout]);

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
  };

  const handleApprove = async (request) => {
    setIsApproveLoading(true);
    try {
      if (!token) {
        logout();
        return;
      }
  
      const isVehicleRequest = request.request_type === 'VehicleRequest';
      const isAdmin = user.account_status === 'Admin';
      const isFacultyAdmin = user.account_status === 'Faculty Admin';
      const distance = request.distance ? parseFloat(request.distance) : 0;
  
      // Check approval permissions
      if (isVehicleRequest) {
        if (isFacultyAdmin && distance > 10) {
          alert("Only Admin can approve requests with distance > 10km");
          return;
        }
      }
  
      // For admin approving vehicle requests, show driver modal first
      if (isAdmin && isVehicleRequest && !selectedDriver) {
        setSelectedRequest(request); // Store the request
        setShowDriverModal(true);
        return;
      }
  
      // Determine the new status
      let status = 'Approved';
      if (isVehicleRequest && isFacultyAdmin) {
        status = request.status === 'FacultyApproved' ? 'Approved' : 'FacultyApproved';
      }
  
      // Prepare approval data
      const approvalData = {
        full_name: request.full_name,
        email: request.email,
        from: request.from,
        to: request.to,
        purpose: request.purpose,
        distance: request.distance,
        date: request.date,
        newtime: request.newtime,
        status,
        approvedBy: {
          id: user._id,
          name: user.full_name,
          role: user.account_status,
          timestamp: new Date().toISOString()
        },
        ...(selectedDriver && {  // Only include driver if one is selected
          AssignedDriver: {
            id: selectedDriver.id,
            name: selectedDriver.name,
            license: selectedDriver.license,
            vehicle: selectedDriver.vehicle,
            contact: selectedDriver.contact
          }
        }),
        rejectionReason: null,
        rejectedBy: null,
      };
  
      // Add to approval chain if faculty admin is approving
      if (isFacultyAdmin && isVehicleRequest) {
        approvalData.approvalChain = [
          ...(request.approvalChain || []),
          approvalData.approvedBy
        ];
      }
  
      // Determine the API endpoint
      const endpoint = isVehicleRequest ? 
        `http://localhost:5000/api/auth/vehicle-request/${request._id}` :
        `http://localhost:5000/api/auth/pending-requests/${request._id}`;
  
      const response = await axios.put(endpoint, approvalData, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const updatedRequest = response.data;
  
      // Update state based on request type and new status
      if (isVehicleRequest) {
        if (status === 'Approved') {
          setApprovedVehicleRequests(prev => [...prev, updatedRequest]);
          setVehicleRequests(prev => prev.filter(r => r._id !== request._id));
        } else { // FacultyApproved
          setVehicleRequests(prev => 
            prev.map(r => r._id === request._id ? updatedRequest : r)
          );
        }
      } else {
        setApprovedGatePassRequests(prev => [...prev, updatedRequest]);
        setGatePassRequests(prev => prev.filter(r => r._id !== request._id));
      }
  
      // Reset driver selection if used
      if (selectedDriver) {
        setSelectedDriver(null);
      }
  
    } catch (error) {
      console.error("Error approving request:", error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setIsApproveLoading(false);
    }
  };

  // Enhanced rejection function
  const handleReject = async (request) => {
    setSelectedRequest(request);
    setShowRejectionModal(true);
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) return;
  
    setIsRejectLoading(true);
    try {
      if (!token) {
        logout();
        return;
      }

      const isVehicleRequest = selectedRequest?.request_type === 'VehicleRequest';
      const endpoint = isVehicleRequest ? 
        `http://localhost:5000/api/auth/vehicle-request/${selectedRequest._id}` :
        `http://localhost:5000/api/auth/pending-requests/${selectedRequest._id}`;

      const rejectionData = { 
        status: 'Rejected', 
        full_name: selectedRequest.full_name,
        email: selectedRequest.email,
        rejectionReason,
        rejectedBy: {
          id: user._id,
          name: user.full_name,
          role: user.account_status,
          timestamp: new Date().toISOString()
        },
        approvedBy: null // Clear approvedBy if rejected
      };
      

      const response = await axios.put(endpoint, rejectionData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedRequest = response.data;

      // Update state based on request type
      if (isVehicleRequest) {
        setRejectedVehicleRequests(prev => [...prev, updatedRequest]);
        setVehicleRequests(prev => prev.filter(r => r._id !== selectedRequest._id));
      } else {
        setRejectedGatePassRequests(prev => [...prev, updatedRequest]);
        setGatePassRequests(prev => prev.filter(r => r._id !== selectedRequest._id));
      }

      // Reset modal state
      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedRequest(null);

    } catch (error) {
      console.error('Error rejecting request:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setIsRejectLoading(false);
    }
  };
  const handleEdit = (request) => {
    // Faculty Admins can't edit >10km requests
    if (request.request_type === 'VehicleRequest' && 
        user.account_status === 'Faculty Admin' &&
        request.distance && parseFloat(request.distance) > 10) {
      alert("Only Admin can edit requests with distance > 10km");
      return;
    }
  
    setSelectedRequest(request);
    setNewStatus(request.status === 'Approved' ? 'Rejected' : 'Approved');
    
    // For vehicle requests changing from Rejected to Approved, show driver modal first
    if (request.request_type === 'VehicleRequest' && 
        request.status === 'Rejected' && 
        user.account_status === 'Admin') {
      setShowDriverModal(true);
    } else {
      setShowEditModal(true);
    }
  };


  const submitEdit = async () => {
    if (!selectedRequest) return;
    
    setIsEditLoading(true);
    try {
      if (!token) {
        logout();
        return;
      }
  
      const isVehicleRequest = selectedRequest.request_type === 'VehicleRequest';
      const endpoint = isVehicleRequest ? 
        `http://localhost:5000/api/auth/vehicle-request/${selectedRequest._id}` :
        `http://localhost:5000/api/auth/pending-requests/${selectedRequest._id}`;
  
      const editData = {
        status: newStatus,
        ...(newStatus === 'Rejected' ? { 
          rejectionReason,
          full_name: selectedRequest.full_name,
          email: selectedRequest.email,
          rejectedBy: {
            id: user._id,
            name: user.full_name,
            role: user.account_status,
            timestamp: new Date().toISOString()
          },
          approvedBy: null,
          AssignedDriver: null 
        } : { 
          full_name: selectedRequest.full_name,
          email: selectedRequest.email,
          from: selectedRequest.from,
          to: selectedRequest.to,
          purpose: selectedRequest.purpose,
          date: selectedRequest.date,
          newtime: selectedRequest.newtime,
          distance: selectedRequest.distance,
          rejectionReason: null,
          approvedBy: {
            id: user._id,
            name: user.full_name,
            role: user.account_status,
            timestamp: new Date().toISOString()
          },
          rejectedBy: null,
          // Include driver assignment if this is a vehicle request being approved
          ...(isVehicleRequest && newStatus === 'Approved' && selectedDriver ? {
            AssignedDriver: {
              id: selectedDriver.id,
              name: selectedDriver.name,
              license: selectedDriver.license,
              vehicle: selectedDriver.vehicle,
              contact: selectedDriver.contact
            }
          } : {})
        })
      };      
  
      const response = await axios.put(endpoint, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const updatedRequest = response.data;
  
      // Update state based on request type
      if (isVehicleRequest) {
        if (newStatus === 'Approved') {
          setApprovedVehicleRequests(prev => [...prev, updatedRequest]);
          setRejectedVehicleRequests(prev => prev.filter(r => r._id !== selectedRequest._id));
        } else {
          setRejectedVehicleRequests(prev => [...prev, updatedRequest]);
          setApprovedVehicleRequests(prev => prev.filter(r => r._id !== selectedRequest._id));
        }
      } else {
        if (newStatus === 'Approved') {
          setApprovedGatePassRequests(prev => [...prev, updatedRequest]);
          setRejectedGatePassRequests(prev => prev.filter(r => r._id !== selectedRequest._id));
        } else {
          setRejectedGatePassRequests(prev => [...prev, updatedRequest]);
          setApprovedGatePassRequests(prev => prev.filter(r => r._id !== selectedRequest._id));
        }
      }
  
      // Reset modal and selection states
      setShowEditModal(false);
      setSelectedRequest(null);
      setNewStatus('');
      setRejectionReason('');
      setSelectedDriver(null);
  
    } catch (error) {
      console.error('Error editing request:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setIsEditLoading(false);
    }
  };

  // Delete function
  const handleDelete = async (request) => {
    setSelectedRequest(request);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedRequest) return;
    
    setIsDeleteLoading(true);
    try {
      if (!token) {
        logout();
        return;
      }

      const isVehicleRequest = selectedRequest.request_type === 'VehicleRequest';
      const endpoint = isVehicleRequest ? 
        `http://localhost:5000/api/auth/vehicle-request/${selectedRequest._id}` :
        `http://localhost:5000/api/auth/pending-requests/${selectedRequest._id}`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update state based on request type and status
      const updateState = (state, setState) => {
        setState(state.filter(r => r._id !== selectedRequest._id));
      };

      if (selectedRequest.status === 'Pending' || selectedRequest.status === 'FacultyApproved') {
        if (isVehicleRequest) {
          updateState(vehicleRequests, setVehicleRequests);
        } else {
          updateState(gatePassRequests, setGatePassRequests);
        }
      } else if (selectedRequest.status === 'Approved') {
        if (isVehicleRequest) {
          updateState(approvedVehicleRequests, setApprovedVehicleRequests);
        } else {
          updateState(approvedGatePassRequests, setApprovedGatePassRequests);
        }
      } else if (selectedRequest.status === 'Rejected') {
        if (isVehicleRequest) {
          updateState(rejectedVehicleRequests, setRejectedVehicleRequests);
        } else {
          updateState(rejectedGatePassRequests, setRejectedGatePassRequests);
        }
      }

      // Reset modal state
      setShowDeleteModal(false);
      setSelectedRequest(null);

    } catch (error) {
      console.error('Error deleting request:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const handleBackToDashboard = (e) => {
    e.preventDefault();
    window.location.href = '/admin-dashboard';
  };

  const handleBackToRequests = () => {
    setShowRequestDetails(false);
    setSelectedRequest(null);
  };

  // Request Card Component with enhanced permissions
  const RequestCard = ({ request, onApprove, onReject, onEdit, onDelete }) => {
    const isVehicleRequest = request.request_type === 'VehicleRequest';
    const isAdmin = user?.account_status === 'Admin';
    const isFacultyAdmin = user?.account_status === 'Faculty Admin';
    const distance = request.distance ? parseFloat(request.distance) : 0;
    
    // Determine if the current user can approve this request
    const canApprove = () => {
      if (!isVehicleRequest) return true;
      if (isAdmin) return true; 
      if (isFacultyAdmin && request.status!=='FacultyApproved') return distance <= 10;
      return false;
    };

    // Determine if the current user can only view (not approve) this request
    const canViewOnly = () => {
      return isVehicleRequest && isFacultyAdmin && distance > 10;
    };

    // Determine if the current user can edit this request
    const canEdit = () => {
      if (!isVehicleRequest) return true;
      if (isAdmin) return true;
      if (isFacultyAdmin) return distance <= 10;
      return false;
    };

    return (
      <div 
        className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition duration-300 cursor-pointer"
        onClick={() => handleRequestClick(request)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-[#800000]">                
              {request.request_type === 'VehicleRequest'
                  ? request.full_name
                  : request.request_type === 'Gate Pass'
                  ? request.visitor_name
                  : ''}
                  
            </h3>
            <p className="text-sm text-gray-600">{request.purpose}</p>
            <p className="text-xs text-gray-500">  
              {request.request_type === 'VehicleRequest'
                ? `${request.date} at ${request.newtime}`
                : request.request_type === 'Gate Pass'
                ? request.visit_date
                : ''}
            </p>
            {isVehicleRequest && request.distance && (
              <p className="text-xs text-gray-500">Distance: {request.distance} km</p>
            )}
            {request.status === 'FacultyApproved' && (
              <div className="flex items-center mt-1">
                <User className="h-3 w-3 text-yellow-600 mr-1" />
                <p className="text-xs text-yellow-600">
                  Approved by {request.approvedBy?.name} (Faculty Admin)
                </p>
              </div>
            )}
          </div>
          <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
            {request.status === 'Pending' || request.status === 'FacultyApproved' ? (
              <>
                {canApprove() && (
  <button
  onClick={(e) => {
    e.stopPropagation();
    setSelectedRequest(request); // Store the request being approved
    handleApprove(request);
  }}
  disabled={isApproveLoading}
  className="p-2 text-green-600 hover:bg-green-50 rounded-full transition duration-300"
  title="Approve request"
>
  {isApproveLoading ? (
    <ClipLoader color="#36d7b7" size={20} />
  ) : (
    <CheckCircle className="h-5 w-5" />
  )}
</button>
                )}
                {canApprove() && (
                  <button
                    onClick={() => onReject(request)}
                    disabled={isRejectLoading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition duration-300"
                    title="Reject request"
                  >
                    {isRejectLoading ? (
                      <ClipLoader color="#ff4444" size={20} />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </button>
                )}
                {canViewOnly() && (
                  <span className="text-xs text-gray-500 self-center px-2">
                    Admin approval required
                  </span>
                )}
              </>
            ) : (
              <>
                {canEdit() && (
                  <button
                    onClick={() => onEdit(request)}
                    disabled={isEditLoading}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition duration-300"
                    title="Edit status"
                  >
                    {isEditLoading ? (
                      <ClipLoader color="#3b82f6" size={20} />
                    ) : (
                      <Edit2 className="h-5 w-5" />
                    )}
                  </button>
                )}
              </>
            )}
            <button
              onClick={() => onDelete(request)}
              disabled={isDeleteLoading}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-300"
              title="Delete request"
            >
              {isDeleteLoading ? (
                <ClipLoader color="#666" size={20} />
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProcessedRequestCard = ({ request, onEdit, onDelete }) => {
    const isVehicleRequest = request.request_type === 'VehicleRequest';
    const isAdmin = user?.account_status === 'Admin';
    const isFacultyAdmin = user?.account_status === 'Faculty Admin';
    const distance = request.distance ? parseFloat(request.distance) : 0;
    
    const canEdit = () => {
      if (!isVehicleRequest) return true;
      if (isAdmin) return true;
      if (isFacultyAdmin) return distance <= 10;
      return false;
    };

    return (
      <div 
        className="bg-white/90 backdrop-blur-sm rounded-lg p-4 hover:shadow-lg transition-all duration-300 border-l-4 border-[#de9e28] cursor-pointer"
        onClick={() => handleRequestClick(request)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-[#800000]">
                {request.request_type === 'VehicleRequest'
    ? request.full_name
    : request.request_type === 'Gate Pass'
    ? request.visitor_name
    : ''}
            </h3>
            <p className="text-sm text-gray-600">{request.purpose}</p>
            <p className="text-xs text-gray-500">
  {request.request_type === 'VehicleRequest'
    ? `${request.date} at ${request.newtime}`
    : request.request_type === 'Gate Pass'
    ? request.visit_date
    : ''}
</p>
            {isVehicleRequest && request.distance && (
              <p className="text-xs text-gray-500">Distance: {request.distance} km</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                request.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                request.status === 'FacultyApproved' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-red-100 text-red-700'
              }`}>
                {request.status === 'FacultyApproved' ? 'Approved by Faculty' : 
                 request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
              {request.approvedBy && (
                <span className="text-xs text-gray-500">
                  Approved by {request.approvedBy.name} ({request.approvedBy.role})
                </span>
              )}
              {request.rejectedBy && (
                <span className="text-xs text-gray-500">
                  Rejected by {request.rejectedBy.name} ({request.rejectedBy.role})
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
            {canEdit() && (
              <button
                onClick={() => onEdit(request)}
                disabled={isEditLoading}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition duration-300"
                title="Edit status"
              >
                {isEditLoading ? (
                  <ClipLoader color="#3b82f6" size={20} />
                ) : (
                  <Edit2 className="h-5 w-5" />
                )}
              </button>
            )}
            <button
              onClick={() => onDelete(request)}
              disabled={isDeleteLoading}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-300"
              title="Delete request"
            >
              {isDeleteLoading ? (
                <ClipLoader color="#666" size={20} />
              ) : (
                <Trash2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProcessedRequestsSection = ({ title, icon: Icon, requests, onEdit, onDelete }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-full ${
          title.includes('Approved') ? 'bg-green-400/10' : 'bg-red-400/10'
        }`}>
          <Icon className={`h-5 w-5 ${
            title.includes('Approved') ? 'text-green-400' : 'text-red-400'
          }`} />
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <span className="ml-auto bg-white/20 px-2.5 py-1 rounded-full text-xs text-white">
          {requests.length} requests
        </span>
      </div>
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-300">No {title.toLowerCase()} yet</p>
          </div>
        ) : (
          requests.map(request => (
            <ProcessedRequestCard 
              key={request._id} 
              request={request} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );

  if (showRequestDetails && selectedRequest) {
    return (
      <RequestDetails 
        request={selectedRequest} 
        onBack={handleBackToRequests}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#800000] via-gray-700 to-[#de9e28] flex items-center justify-center">
        <ClipLoader color="#ffffff" size={50} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800000] via-gray-700 to-[#de9e28] p-6 mt-14">
      <div className="container mx-auto">
        <button 
          onClick={handleBackToDashboard}
          className="flex items-center text-white mb-6 hover:text-[#de9e28] transition duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vehicle Requests */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Vehicle Requests</h2>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-3 py-1.5 rounded-full text-sm text-white font-medium">
                  {vehicleRequests.length} Pending
                </span>
                <span className="bg-green-400/20 px-3 py-1.5 rounded-full text-sm text-green-400 font-medium">
                  {approvedVehicleRequests.length} Approved
                </span>
                <span className="bg-red-400/20 px-3 py-1.5 rounded-full text-sm text-red-400 font-medium">
                  {rejectedVehicleRequests.length} Rejected
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {vehicleRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-300">No pending vehicle requests</p>
                </div>
              ) : (
                vehicleRequests.map(request => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>

          {/* Gate Pass Requests */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Gate Pass Requests</h2>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-3 py-1.5 rounded-full text-sm text-white font-medium">
                  {gatePassRequests.length} Pending
                </span>
                <span className="bg-green-400/20 px-3 py-1.5 rounded-full text-sm text-green-400 font-medium">
                  {approvedGatePassRequests.length} Approved
                </span>
                <span className="bg-red-400/20 px-3 py-1.5 rounded-full text-sm text-red-400 font-medium">
                  {rejectedGatePassRequests.length} Rejected
                </span>
              </div>
            </div>
            <div className="space-y-4">
              {gatePassRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-300">No pending gate pass requests</p>
                </div>
              ) : (
                gatePassRequests.map(request => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Processed Vehicle Requests */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProcessedRequestsSection
            title="Approved Vehicle Requests"
            icon={CheckCircle}
            requests={approvedVehicleRequests}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <ProcessedRequestsSection
            title="Rejected Vehicle Requests"
            icon={XCircle}
            requests={rejectedVehicleRequests}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Processed Gate Pass Requests */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProcessedRequestsSection
            title="Approved Gate Pass Requests"
            icon={CheckCircle}
            requests={approvedGatePassRequests}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <ProcessedRequestsSection
            title="Rejected Gate Pass Requests"
            icon={XCircle}
            requests={rejectedGatePassRequests}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Rejection Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-xl font-bold text-[#800000]">Reject Request</h3>
              </div>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
                placeholder="Enter reason for rejection..."
                rows="3"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isRejectLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={submitRejection}
                  className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#900000] flex items-center justify-center"
                  disabled={isRejectLoading || !rejectionReason.trim()}
                >
                  {isRejectLoading ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
      <div className="flex items-center mb-4">
        <Edit2 className="h-6 w-6 text-[#de9e28] mr-2" />
        <h3 className="text-xl font-bold text-[#800000]">Edit Request Status</h3>
      </div>
      <p className="mb-4 text-gray-600">
        Change status from <span className="font-semibold">{selectedRequest?.status}</span> to{' '}
        <span className="font-semibold">{newStatus}</span>
      </p>
      
      {/* Show driver assignment status if applicable */}
      {selectedRequest?.request_type === 'VehicleRequest' && 
       newStatus === 'Approved' && (
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          {selectedDriver ? (
            <div>
              <p className="font-medium">Assigned Driver:</p>
              <p>{selectedDriver.name} ({selectedDriver.license})</p>
              <p>Vehicle: {selectedDriver.vehicle}</p>
            </div>
          ) : (
            <p className="text-red-600">No driver assigned yet!</p>
          )}
          <button
            onClick={() => {
              setShowEditModal(false);
              setShowDriverModal(true);
            }}
            className="mt-2 text-sm text-[#800000] hover:underline"
          >
            {selectedDriver ? "Change Driver" : "Assign Driver"}
          </button>
        </div>
      )}
      
      {newStatus === 'Rejected' && (
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md mb-4"
          placeholder="Enter reason for rejection..."
          rows="3"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        />
      )}
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setShowEditModal(false);
            setRejectionReason('');
            setNewStatus('');
          }}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={isEditLoading}
        >
          Cancel
        </button>
        <button
          onClick={submitEdit}
          className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#900000] flex items-center justify-center"
          disabled={
            isEditLoading || 
            (newStatus === 'Rejected' && !rejectionReason.trim()) ||
            (newStatus === 'Approved' && 
             selectedRequest?.request_type === 'VehicleRequest' && 
             !selectedDriver)
          }
        >
          {isEditLoading ? (
            <ClipLoader color="#ffffff" size={20} />
          ) : (
            "Update Status"
          )}
        </button>
      </div>
    </div>
  </div>
)}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center mb-4">
                <Trash2 className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-xl font-bold text-[#800000]">Delete Request</h3>
              </div>
              <p className="mb-4 text-gray-600">
                Are you sure you want to delete this request? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={isDeleteLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
                  disabled={isDeleteLoading}
                >
                  {isDeleteLoading ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

{showDriverModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold text-[#800000] mb-4">
        {selectedRequest?.status === 'Rejected' ? 
          "Assign Driver (Required for Approval)" : 
          "Assign Driver"}
      </h2>
      
      {driversLoading ? (
        <div className="flex justify-center py-8">
          <ClipLoader color="#800000" size={30} />
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            {selectedRequest?.status === 'Rejected' ?
              "You must select a driver to approve this previously rejected request:" :
              "Select a driver for this vehicle request:"}
          </p>
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
            {availableDrivers.map(driver => (
              <div 
                key={driver.id}
                onClick={() => handleDriverSelect(driver)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedDriver?.id === driver.id 
                    ? 'border-[#800000] bg-[#800000]/10' 
                    : 'border-gray-200 hover:border-[#800000]/50'
                }`}
              >
                <div className="font-medium">{driver.name}</div>
                <div className="text-sm text-gray-600">License: {driver.license}</div>
                <div className="text-sm text-gray-600">Contact: {driver.contact}</div>
                <div className="text-sm text-gray-600">Vehicle: {driver.vehicle}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setShowDriverModal(false);
            setSelectedDriver(null);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          disabled={driversLoading}
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            if (selectedRequest) {
              if (selectedRequest.status === 'Rejected') {
                // For rejected->approved flow, show edit modal after driver selection
                setShowEditModal(true);
              } else {
                // For regular approval flow
                await handleApprove(selectedRequest);
              }
              setShowDriverModal(false);
            }
          }}
          disabled={!selectedDriver || driversLoading}
          className={`px-4 py-2 rounded-lg text-white ${
            selectedDriver && !driversLoading
              ? 'bg-[#800000] hover:bg-[#600000]' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isApproveLoading ? (
            <ClipLoader color="#ffffff" size={20} />
          ) : (
            "Confirm Selection"
          )}
        </button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}

export default PendingRequests;