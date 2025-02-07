import React, { useState } from 'react';
import { CheckCircle, XCircle, ArrowLeft, AlertCircle } from 'lucide-react';

function PendingRequests() {
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Sample data - replace with your actual data
  const [vehicleRequests, setVehicleRequests] = useState([
    { id: 1, user: 'John Doe', type: 'Vehicle', purpose: 'Official Visit', date: '2024-03-20', status: 'pending' },
    { id: 2, user: 'Jane Smith', type: 'Vehicle', purpose: 'Field Work', date: '2024-03-21', status: 'pending' },
  ]);

  const [gatePassRequests, setGatePassRequests] = useState([
    { id: 3, user: 'Mike Johnson', type: 'GatePass', purpose: 'Early Leave', date: '2024-03-20', status: 'pending' },
    { id: 4, user: 'Sarah Wilson', type: 'GatePass', purpose: 'Personal Work', date: '2024-03-21', status: 'pending' },
  ]);

  const [approvedVehicleRequests, setApprovedVehicleRequests] = useState([]);
  const [approvedGatePassRequests, setApprovedGatePassRequests] = useState([]);
  const [rejectedVehicleRequests, setRejectedVehicleRequests] = useState([]);
  const [rejectedGatePassRequests, setRejectedGatePassRequests] = useState([]);

  const handleApprove = (request) => {
    const updatedRequest = { ...request, status: 'approved' };
    
    if (request.type === 'Vehicle') {
      setApprovedVehicleRequests([...approvedVehicleRequests, updatedRequest]);
      setVehicleRequests(vehicleRequests.filter(req => req.id !== request.id));
    } else {
      setApprovedGatePassRequests([...approvedGatePassRequests, updatedRequest]);
      setGatePassRequests(gatePassRequests.filter(req => req.id !== request.id));
    }
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setShowRejectionModal(true);
  };

  const submitRejection = () => {
    if (!rejectionReason.trim()) return;

    const updatedRequest = { 
      ...selectedRequest, 
      status: 'rejected',
      rejectionReason 
    };
    
    if (selectedRequest.type === 'Vehicle') {
      setRejectedVehicleRequests([...rejectedVehicleRequests, updatedRequest]);
      setVehicleRequests(vehicleRequests.filter(req => req.id !== selectedRequest.id));
    } else {
      setRejectedGatePassRequests([...rejectedGatePassRequests, updatedRequest]);
      setGatePassRequests(gatePassRequests.filter(req => req.id !== selectedRequest.id));
    }
    
    setShowRejectionModal(false);
    setRejectionReason('');
    setSelectedRequest(null);
  };

  const RequestCard = ({ request, onApprove, onReject }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-[#800000]">{request.user}</h3>
          <p className="text-sm text-gray-600">{request.purpose}</p>
          <p className="text-xs text-gray-500">{request.date}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onApprove(request)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition duration-300"
          >
            <CheckCircle className="h-5 w-5" />
          </button>
          <button
            onClick={() => onReject(request)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition duration-300"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800000] via-gray-700 to-[#de9e28] p-6">
      <div className="container mx-auto">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-white mb-6 hover:text-[#de9e28] transition duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vehicle Requests */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Vehicle Requests</h2>
            <div className="space-y-4">
              {vehicleRequests.map(request => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          </div>

          {/* Gate Pass Requests */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Gate Pass Requests</h2>
            <div className="space-y-4">
              {gatePassRequests.map(request => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Processed Vehicle Requests */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Approved Vehicle Requests */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              Approved Vehicle Requests
            </h2>
            <div className="space-y-3">
              {approvedVehicleRequests.map(request => (
                <div key={request.id} className="bg-white/90 rounded-lg p-3">
                  <h3 className="font-semibold text-[#800000]">{request.user}</h3>
                  <p className="text-sm text-gray-600">{request.purpose}</p>
                  <p className="text-xs text-green-600">Approved</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rejected Vehicle Requests */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <XCircle className="h-5 w-5 mr-2 text-red-400" />
              Rejected Vehicle Requests
            </h2>
            <div className="space-y-3">
              {rejectedVehicleRequests.map(request => (
                <div key={request.id} className="bg-white/90 rounded-lg p-3">
                  <h3 className="font-semibold text-[#800000]">{request.user}</h3>
                  <p className="text-sm text-gray-600">{request.purpose}</p>
                  <p className="text-xs text-red-600">Rejected: {request.rejectionReason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Processed Gate Pass Requests */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Approved Gate Pass Requests */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              Approved Gate Pass Requests
            </h2>
            <div className="space-y-3">
              {approvedGatePassRequests.map(request => (
                <div key={request.id} className="bg-white/90 rounded-lg p-3">
                  <h3 className="font-semibold text-[#800000]">{request.user}</h3>
                  <p className="text-sm text-gray-600">{request.purpose}</p>
                  <p className="text-xs text-green-600">Approved</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rejected Gate Pass Requests */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <XCircle className="h-5 w-5 mr-2 text-red-400" />
              Rejected Gate Pass Requests
            </h2>
            <div className="space-y-3">
              {rejectedGatePassRequests.map(request => (
                <div key={request.id} className="bg-white/90 rounded-lg p-3">
                  <h3 className="font-semibold text-[#800000]">{request.user}</h3>
                  <p className="text-sm text-gray-600">{request.purpose}</p>
                  <p className="text-xs text-red-600">Rejected: {request.rejectionReason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rejection Modal */}
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
                  onClick={() => setShowRejectionModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRejection}
                  className="px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#900000]"
                >
                  Submit
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