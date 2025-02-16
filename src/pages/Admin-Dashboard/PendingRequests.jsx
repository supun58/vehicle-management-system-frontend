import React, { useEffect,useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  AlertCircle, 
  Clock, 
  Edit2, 
  Trash2 
} from 'lucide-react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

import RequestDetails from './RequestDetails';

function PendingRequests() {
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [request, setRequest] = useState(null);

  // Loading states
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);


  const [vehicleRequests, setVehicleRequests] = useState([]);
  const [gatePassRequests, setGatePassRequests] = useState([]);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          console.error("No token found");
          return;
        }
  
        const response = await axios.get('http://localhost:5000/api/auth/pending-requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = response.data;  // Axios automatically parses JSON
        setRequest(data);  // Set the response data to the state
        console.log(data);

      setVehicleRequests(data.filter(request => request.status === 'Pending' && request.request_type === 'Vehicle Pass'));
      setGatePassRequests(data.filter(request => request.status === 'Pending' && request.request_type !== 'Vehicle Pass'));
      setApprovedVehicleRequests(data.filter(request => request.status === 'Approved' && request.request_type === 'Vehicle Pass'));
      setApprovedGatePassRequests(data.filter(request => request.status === 'Approved' && request.request_type !== 'Vehicle Pass'));
      setRejectedVehicleRequests(data.filter(request => request.status === 'Rejected' && request.request_type === 'Vehicle Pass'));
      setRejectedGatePassRequests(data.filter(request => request.status === 'Rejected' && request.request_type !== 'Vehicle Pass'));

      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Handle token expiration or invalid token
          console.error("Session expired or unauthorized. Please log in again.");
          sessionStorage.removeItem('token');
          window.location.href = '/'; // Redirect to login page
        } else {
          console.error("Error getting request:", error);
        }
      }
    };
  
    fetchPendingRequests();
  }, []);  

  const [approvedVehicleRequests, setApprovedVehicleRequests] = useState([]);
  const [approvedGatePassRequests, setApprovedGatePassRequests] = useState([]);
  const [rejectedVehicleRequests, setRejectedVehicleRequests] = useState([]);
  const [rejectedGatePassRequests, setRejectedGatePassRequests] = useState([]);

  const handleApprove = async (request) => {
    setIsApproveLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        return;
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/auth/pending-requests/${request._id}`,
        { status: 'Approved' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const updatedRequest = response.data;

    // Update local state
    if (request.request_type === 'Vehicle Pass') {
      // Add the approved request to the approved list
      setApprovedVehicleRequests([...approvedVehicleRequests, updatedRequest]);
      // Remove the approved request from the pending list
      setVehicleRequests(vehicleRequests.filter(req => req._id !== request._id));
    } else {
      // Add the approved request to the approved list
      setApprovedGatePassRequests([...approvedGatePassRequests, updatedRequest]);
      // Remove the approved request from the pending list
      setGatePassRequests(gatePassRequests.filter(req => req._id !== request._id));
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Handle token expiration or invalid token
        console.error("Session expired or unauthorized. Please log in again.");
        sessionStorage.removeItem('token');
        window.location.href = '/'; // Redirect to login page
      } else {
        console.error("Error approving request:", error);
      }
    }
      finally {
        setIsApproveLoading(false);
    }
    
  };

  const handleReject = async (request) => {
    setSelectedRequest(request);
    setShowRejectionModal(true);
  };
  
  const submitRejection = async () => {
    if (!rejectionReason.trim()) return;
  
    setIsRejectLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        return;
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/auth/pending-requests/${selectedRequest._id}`,
        { status: 'Rejected', rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const updatedRequest = response.data;

    // Update local state
    if (selectedRequest.request_type === 'Vehicle Pass') {
      // Add the rejected request to the rejected list
      setRejectedVehicleRequests([...rejectedVehicleRequests, updatedRequest]);
      // Remove the rejected request from the pending list
      setVehicleRequests(vehicleRequests.filter(req => req._id !== selectedRequest._id));
    } else {
      // Add the rejected request to the rejected list
      setRejectedGatePassRequests([...rejectedGatePassRequests, updatedRequest]);
      // Remove the rejected request from the pending list
      setGatePassRequests(gatePassRequests.filter(req => req._id !== selectedRequest._id));
    }

    // Close the modal and reset the form fields
    setShowRejectionModal(false);
    setRejectionReason('');
    setSelectedRequest(null);
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
    finally {
      setIsRejectLoading(false);
    }
  };
  

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status === 'Approved' ? 'Rejected' : 'Approved');
    setShowEditModal(true);
  };

  const handleDelete = async (request) => {
    console.log("Delete button clicked", request); // Debugging

    setSelectedRequest(request); // Set the request to be deleted
    setShowDeleteModal(true); // Open the delete confirmation modal
  };
  
  const confirmDelete = async () => {
    if (!selectedRequest) return;
  
    setIsDeleteLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        return;
      }
  
      // Make the API call to delete the request
      await axios.delete(
        `http://localhost:5000/api/auth/pending-requests/${selectedRequest._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Function to update the state based on the request's status and type
      const updateState = (requests, setRequests) => {
        setRequests(requests.filter(request => request._id !== selectedRequest._id));
      };
  
      // Update the local state based on the request's status and type
      if (selectedRequest.status === 'Pending') {
        if (selectedRequest.request_type === 'Vehicle Pass') {
          updateState(vehicleRequests, setVehicleRequests);
        } else {
          updateState(gatePassRequests, setGatePassRequests);
        }
      } else if (selectedRequest.status === 'Approved') {
        if (selectedRequest.request_type === 'Vehicle Pass') {
          updateState(approvedVehicleRequests, setApprovedVehicleRequests);
        } else {
          updateState(approvedGatePassRequests, setApprovedGatePassRequests);
        }
      } else if (selectedRequest.status === 'Rejected') {
        if (selectedRequest.request_type === 'Vehicle Pass') {
          updateState(rejectedVehicleRequests, setRejectedVehicleRequests);
        } else {
          updateState(rejectedGatePassRequests, setRejectedGatePassRequests);
        }
      }
  
      // Close the modal and reset the selected request
      setShowDeleteModal(false);
      setSelectedRequest(null);
  
      // Optionally, show a success message
      console.log("Request deleted successfully!");
    } catch (error) {
      console.error('Error deleting request:', error);
      if (error.response && error.response.status === 401) {
        // Handle token expiration or invalid token
        console.error("Session expired or unauthorized. Please log in again.");
        sessionStorage.removeItem('token');
        window.location.href = '/'; // Redirect to login page
      } else {
        console.error("Error deleting request:", error);
      }
    }
      finally {
        setIsDeleteLoading(false);
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
  };

  const handleBackToDashboard = (e) => {
    e.preventDefault(); // Prevent default behavior
    window.location.href = '/admin-dashboard';
  };

  const handleBackToRequests = () => {
    setShowRequestDetails(false);
    setSelectedRequest(null);
  };

  const submitEdit = async () => {

    setIsEditLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error("No token found");
        return;
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/auth/pending-requests/${selectedRequest._id}`,
        { status: newStatus, rejectionReason: newStatus === 'Rejected' ? rejectionReason : null },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const updatedRequest = response.data;

      // Update local state
      if (selectedRequest.request_type === 'Vehicle Pass') {
        if (selectedRequest.status === 'Approved') {
          // Move from approved to rejected
          setApprovedVehicleRequests(approvedVehicleRequests.filter(req => req._id !== selectedRequest._id));
          setRejectedVehicleRequests([...rejectedVehicleRequests, updatedRequest]);
        } else {
          // Move from rejected to approved
          setRejectedVehicleRequests(rejectedVehicleRequests.filter(req => req._id !== selectedRequest._id));
          setApprovedVehicleRequests([...approvedVehicleRequests, updatedRequest]);
        }
      } else {
        if (selectedRequest.status === 'Approved') {
          // Move from approved to rejected
          setApprovedGatePassRequests(approvedGatePassRequests.filter(req => req._id !== selectedRequest._id));
          setRejectedGatePassRequests([...rejectedGatePassRequests, updatedRequest]);
        } else {
          // Move from rejected to approved
          setRejectedGatePassRequests(rejectedGatePassRequests.filter(req => req._id !== selectedRequest._id));
          setApprovedGatePassRequests([...approvedGatePassRequests, updatedRequest]);
        }
      }
  
      // Close the modal and reset the form fields
      setShowEditModal(false);
      setSelectedRequest(null);
      setNewStatus('');
      setRejectionReason('');
    } catch (error) {
      console.error('Error updating request status:', error);
    }
    finally {
      setIsEditLoading(false);
    }
  };

  const RequestCard = ({ 
    request, 
    onApprove, 
    onReject, 
    onDelete, 
    isApproveLoading, 
    isRejectLoading, 
    isDeleteLoading 
  }) => (
    <div 
      className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition duration-300 cursor-pointer"
      onClick={() => handleRequestClick(request)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-[#800000]">{request.visitor_name}</h3>
          <p className="text-sm text-gray-600">{request.purpose}</p>
          <p className="text-xs text-gray-500">{request.visit_date}</p>
        </div>
        <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onApprove(request)}
            disabled={isApproveLoading}
            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition duration-300"
          >
            {isApproveLoading ? (
              <ClipLoader color="#36d7b7" size={20} /> // Show spinner
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => onReject(request)}
            disabled={isRejectLoading}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition duration-300"
          >
            {isRejectLoading ? (
              <ClipLoader color="#ff4444" size={20} /> // Show spinner
            ) : (
              <XCircle className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => onDelete(request)}
            disabled={isDeleteLoading}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-300"
          >
            {isDeleteLoading ? (
              <ClipLoader color="#666" size={20} /> // Show spinner
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const ProcessedRequestCard = ({ 
    request, 
    onEdit, 
    onDelete, 
    isEditLoading, 
    isDeleteLoading 
  }) => (
    <div 
      className="bg-white/90 backdrop-blur-sm rounded-lg p-4 hover:shadow-lg transition-all duration-300 border-l-4 border-[#de9e28] cursor-pointer"
      onClick={() => handleRequestClick(request)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-[#800000]">{request.visitor_name}</h3>
          <p className="text-sm text-gray-600">{request.purpose}</p>
          <p className="text-xs text-gray-500">{request.visit_date}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              request.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onEdit(request)}
            disabled={isEditLoading}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition duration-300"
          >
            {isEditLoading ? (
              <ClipLoader color="#3b82f6" size={20} /> // Show spinner
            ) : (
              <Edit2 className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => onDelete(request)}
            disabled={isDeleteLoading}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition duration-300"
          >
            {isDeleteLoading ? (
              <ClipLoader color="#666" size={20} /> // Show spinner
            ) : (
              <Trash2 className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );

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
              onEdit={onEdit}
              onDelete={handleDelete}
              isEditLoading={isEditLoading}
              isDeleteLoading={isDeleteLoading}
            />
          ))
        )}
      </div>
    </div>
  );

  if (showRequestDetails && selectedRequest) {
    return <RequestDetails 
      request={selectedRequest} 
      onBack={handleBackToRequests}
      onBackToDashboard={handleBackToDashboard}
    />;
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
              {vehicleRequests.map(request => (
                <RequestCard
                  key={request._id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                  isApproveLoading={isApproveLoading}
                  isRejectLoading={isRejectLoading}
                  isDeleteLoading={isDeleteLoading}
                />
              ))}
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
              {gatePassRequests.map(request => (
                <RequestCard
                  key={request._id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                  isApproveLoading={isApproveLoading}
                  isRejectLoading={isRejectLoading}
                  isDeleteLoading={isDeleteLoading}
                />
              ))}
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

        {showRejectionModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
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
          disabled={isRejectLoading} // Disable button during loading
        >
          Cancel
        </button>
        <button
          onClick={submitRejection}
          className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#900000] flex items-center justify-center"
          disabled={isRejectLoading} // Disable button during loading
        >
          {isRejectLoading ? (
            <ClipLoader color="#ffffff" size={20} /> // Show spinner
          ) : (
            "Submit"
          )}
        </button>
      </div>
    </div>
  </div>
)}

{showEditModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
      <div className="flex items-center mb-4">
        <Edit2 className="h-6 w-6 text-[#de9e28] mr-2" />
        <h3 className="text-xl font-bold text-[#800000]">Edit Request Status</h3>
      </div>
      <p className="mb-4 text-gray-600">
        Change status from <span className="font-semibold">{selectedRequest.status}</span> to{' '}
        <span className="font-semibold">{newStatus}</span>
      </p>
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
          disabled={isEditLoading} // Disable button during loading
        >
          Cancel
        </button>
        <button
          onClick={submitEdit}
          className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#900000] flex items-center justify-center"
          disabled={isEditLoading || (newStatus === 'Rejected' && !rejectionReason.trim())} // Disable button during loading
        >
          {isEditLoading ? (
            <ClipLoader color="#ffffff" size={20} /> // Show spinner
          ) : (
            "Update Status"
          )}
        </button>
      </div>
    </div>
  </div>
)}

{showDeleteModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
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
          disabled={isDeleteLoading} // Disable button during loading
        >
          Cancel
        </button>
        <button
          onClick={confirmDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center"
          disabled={isDeleteLoading} // Disable button during loading
        >
          {isDeleteLoading ? (
            <ClipLoader color="#ffffff" size={20} /> // Show spinner
          ) : (
            "Delete"
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