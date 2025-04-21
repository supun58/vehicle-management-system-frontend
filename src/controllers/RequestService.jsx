import axios from 'axios';

export const approveRequest = async (request, user, token, logout) => {
  try {
    if (!token) {
      logout();
      return null;
    }

    const isVehicleRequest = request.request_type === 'VehicleRequest';
    const isAdmin = user.account_status === 'Admin';
    const isFacultyAdmin = user.account_status === 'Faculty Admin';
    const distance = request.distance ? parseFloat(request.distance) : 0;

    // Check approval permissions
    if (isVehicleRequest) {
      if (isFacultyAdmin && distance > 10) {
        alert("Only Admin can approve requests with distance > 10km");
        return null;
      }
    }

    // Determine the new status
    let status = 'Approved';
    if (isVehicleRequest && isFacultyAdmin) {
      status = request.status === 'FacultyApproved' ? 'Approved' : 'FacultyApproved';
    }

    // Prepare approval data
    const approvalData = {
      status,
      approvedBy: {
        id: user._id,
        name: user.full_name,
        role: user.account_status,
        timestamp: new Date().toISOString()
      },
      rejectionReason: null,
      rejectedBy: null,
    };

    if (isFacultyAdmin && isVehicleRequest) {
      approvalData.approvalChain = [
        ...(request.approvalChain || []),
        approvalData.approvedBy
      ];
    }

    const endpoint = isVehicleRequest ? 
      `https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/vehicle-request/${request._id}` :
      `https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/pending-requests/${request._id}`;

    const response = await axios.put(endpoint, approvalData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;

  } catch (error) {
    console.error("Error approving request:", error);
    if (error.response?.status === 401) {
      logout();
    }
    throw error;
  }
};

export const rejectRequest = async (request, rejectionReason, user, token, logout) => {
  try {
    if (!token) {
      logout();
      return null;
    }

    const isVehicleRequest = request.request_type === 'VehicleRequest';
    const endpoint = isVehicleRequest ? 
      `https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/vehicle-request/${request._id}` :
      `https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/pending-requests/${request._id}`;

    const rejectionData = { 
      status: 'Rejected', 
      rejectionReason,
      rejectedBy: {
        id: user._id,
        name: user.full_name,
        role: user.account_status,
        timestamp: new Date().toISOString()
      },
      approvedBy: null
    };

    const response = await axios.put(endpoint, rejectionData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;

  } catch (error) {
    console.error('Error rejecting request:', error);
    if (error.response?.status === 401) {
      logout();
    }
    throw error;
  }
};