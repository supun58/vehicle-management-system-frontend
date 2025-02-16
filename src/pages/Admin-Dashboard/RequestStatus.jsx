import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RequestStatus = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch request status from the backend
    const fetchRequestStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/request-status/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch request status');
        }
        const data = await response.json();
        setRequest(data.request);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestStatus();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-lg text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 mt-14"> 
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-3"> 
        <h1 className="text-2xl font-bold text-[#800000] mb-4 text-center">Request Status</h1> 
        {request ? (
          <>
            {/* Status Section */}
            <div className="text-center mb-6">
              {request.status === 'Approved' ? (
                <p className="text-3xl font-bold text-green-600">APPROVED</p>
              ) : (
                <p className="text-3xl font-bold text-red-600">REJECTED</p> 
              )}
            </div>
  
            {/* Visitor Details */}
            <div className="space-y-1"> 
              <div className="bg-gray-50 p-1 rounded-lg"> 
                <p className="text-base font-medium text-gray-600">Visitor Name:</p> 
                <p className="text-lg text-gray-900 font-semibold">{request.visitor_name}</p> 
              </div>
              <div className="bg-gray-50 p-1 rounded-lg">
                <p className="text-base font-medium text-gray-600">NIC:</p>
                <p className="text-lg text-gray-900 font-semibold">{request.nic}</p>
              </div>
              <div className="bg-gray-50 p-1 rounded-lg">
                <p className="text-base font-medium text-gray-600">Visitor Email:</p>
                <p className="text-lg text-gray-900 font-semibold">{request.visitor_email}</p>
              </div>
              <div className="bg-gray-50 p-1 rounded-lg">
                <p className="text-base font-medium text-gray-600">Request ID:</p>
                <p className="text-lg text-gray-900 font-semibold">{request.id}</p>
              </div>
              <div className="bg-gray-50 p-1 rounded-lg">
                <p className="text-base font-medium text-gray-600">Date:</p>
                <p className="text-lg text-gray-900 font-semibold">{request.visit_date}</p>
              </div>
              <div className="bg-gray-50 p-1 rounded-lg">
                <p className="text-base font-medium text-gray-600">Entry Time:</p>
                <p className="text-lg text-gray-900 font-semibold">{request.entry_time}</p>
              </div>
              <div className="bg-gray-50 p-1 rounded-lg">
                <p className="text-base font-medium text-gray-600">Exit Time:</p>
                <p className="text-lg text-gray-900 font-semibold">{request.exit_time}</p>
              </div>
              <div className="bg-gray-50 p-1 rounded-lg">
                <p className="text-base font-medium text-gray-600">Purpose:</p>
                <p className="text-lg text-gray-900 font-semibold">{request.purpose}</p>
              </div>
            </div>
            </>
          ) : (
            <p className="text-base text-gray-700 text-center">No request found.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default RequestStatus;