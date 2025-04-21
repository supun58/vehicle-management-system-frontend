import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/authcontext'; 
import { ArrowLeft } from 'lucide-react';

const RequestStatus = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, logout } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch request status from the backend
    const fetchRequestStatus = async () => {
      setLoading(true);
      setError('');
      
      try {   
        if (!token) {
          throw new Error('Authentication required');
        }
    
        const response = await fetch(`https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/request-status/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch request status');
        }
    
        const data = await response.json();
        setRequest(data.request);
      } catch (error) {
        setError(error.message);
        console.error('Fetch request error:', error);
        
        // Handle unauthorized errors
        if (error.message.includes('Session expired') || 
            error.message.includes('Authentication required')) {
          logout();
          // Optionally redirect to login
          // navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequestStatus();
  }, [id, token, logout, navigate]); 

 
   const BackArrow = () => (
    <button 
      onClick={() => navigate(-1)}
      className="absolute top-3 left-3 text-[#800000] hover:text-[#a04040] transition-colors"
      aria-label="Go back"
    >
      <ArrowLeft size={36} />
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-4 mt-14 relative">
        <BackArrow />
        <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
          <div className="text-center">
            <p className="text-lg text-gray-700">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-4 mt-14 relative">
        <BackArrow />
        <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
          <div className="text-center">
            <p className="text-lg text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-4 mt-14">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-3 relative"> 
        <BackArrow />
        
        <h1 className="text-2xl font-bold text-[#800000] mb-4 text-center">Request Status</h1>
        
        {request ? (
          <>
            <div className="text-center mb-6">
              {request.status === 'Approved' ? (
                <p className="text-3xl font-bold text-green-600">APPROVED</p>
              ) : (
                <p className="text-3xl font-bold text-red-600">REJECTED</p>
              )}
            </div>
  
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
          <>
            <BackArrow />
            <p className="text-base text-gray-700 text-center">No request found.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestStatus;