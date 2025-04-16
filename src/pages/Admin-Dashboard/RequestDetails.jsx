import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User,
  Mail,
  Phone,
  CreditCard,
  Car,
  FileText,
  Calendar,
  Timer,
  CheckSquare,
  Repeat,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Users,
  Navigation
} from 'lucide-react';

function RequestDetails({ request, onBack }) {
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  
  // Mock driver data
  const availableDrivers = [
    { id: 1, name: 'John Doe', license: 'B1234567', contact: '0712345678' },
    { id: 2, name: 'Jane Smith', license: 'B7654321', contact: '0776543210' },
    { id: 3, name: 'Robert Johnson', license: 'B1122334', contact: '0711223344' },
  ];

  if (!request) {
    return <div className="min-h-screen bg-gradient-to-br from-[#800000] via-gray-700 to-[#de9e28] mt-14 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">Loading request details...</div>
    </div>;
  }

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'facultyapproved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
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

  const getDirections = () => {
    try {
      if (!request.from?.coordinates || !request.to?.coordinates) {
        console.error('Missing coordinates for directions');
        return;
      }
      const [fromLng, fromLat] = request.from.coordinates;
      const [toLng, toLat] = request.to.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=driving`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error getting directions:', error);
    }
  };

  // const handleDriverSelect = (driver) => {
  //   setSelectedDriver(driver);
  // };

  // const confirmApproval = () => {
  //   if (selectedDriver && handleApprove) {
  //     handleApprove(request.id, selectedDriver);
  //     setShowDriverModal(false);
  //   }
  // };
  
  const renderGatePassDetails = () => (
    <>
      {/* Personal Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#800000] mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Visitor Name</p>
              <p className="font-medium">{request.visitor_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{request.visitor_email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{request.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">NIC</p>
              <p className="font-medium">{request.nic}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#800000] mb-4">Vehicle Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Car className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Vehicle Number</p>
              <p className="font-medium">{request.vehicle_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Car className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Vehicle Type</p>
              <p className="font-medium">{request.vehicle_type}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Details */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#800000] mb-4">Visit Details</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Purpose</p>
              <p className="font-medium">{request.purpose}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Meeting Person</p>
              <p className="font-medium">{request.meeting_person}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Visit Date</p>
              <p className="font-medium">{new Date(request.visit_date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-[#800000]" />
              <div>
                <p className="text-sm text-gray-600">Entry Time</p>
                <p className="font-medium">{request.entry_time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Timer className="h-5 w-5 text-[#800000]" />
              <div>
                <p className="text-sm text-gray-600">Exit Time</p>
                <p className="font-medium">{request.exit_time}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status and Verification */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#800000] mb-4">Status & Verification</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {request.status?.toLowerCase() === 'approved' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : request.status?.toLowerCase() === 'rejected' ? (
              <XCircle className="h-5 w-5 text-red-600" />
            ) : (
              <Timer className="h-5 w-5 text-yellow-600" />
            )}
            <div>
              <p className="text-sm text-gray-600">Request Status</p>
              <p className="font-medium">{request.status}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckSquare className={`h-5 w-5 ${request.consent ? 'text-green-600' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm text-gray-600">Security Policy</p>
              <p className="font-medium">{request.consent ? 'Agreed' : 'Not Agreed'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Repeat className={`h-5 w-5 ${request.is_regular_comer ? 'text-blue-600' : 'text-gray-400'}`} />
            <div>
              <p className="text-sm text-gray-600">Visitor Type</p>
              <p className="font-medium">{request.is_regular_comer ? 'Regular Visitor' : 'One-time Visitor'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderVehicleRequestDetails = () => (
    <>
      {/* Requester Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#800000] mb-4">Requester Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{request.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{request.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Contact</p>
              <p className="font-medium">{request.contact}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <p className="font-medium">{request.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#800000] mb-4">Vehicle Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Car className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Vehicle Type</p>
              <p className="font-medium">{request.vehicleType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#800000] mb-4">Trip Details</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Purpose</p>
              <p className="font-medium">{request.purpose}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-medium">{new Date(request.date).toLocaleDateString()}</p>
            </div>
          </div>

          {/*time*/}
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-medium">{request.newtime}</p>
            </div>
          </div>

          {/* Location and Directions */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#800000]" />
              <div>
                <p className="text-sm text-gray-600">From</p>
                <div 
                  className="font-medium cursor-pointer text-blue-600 hover:underline"
                  onClick={() => openMapWithCoordinates(request.from)}
                >
                  {formatCoordinates(request.from)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[#800000]" />
              <div>
                <p className="text-sm text-gray-600">To</p>
                <div 
                  className="font-medium cursor-pointer text-blue-600 hover:underline"
                  onClick={() => openMapWithCoordinates(request.to)}
                >
                  {formatCoordinates(request.to)}
                </div>
              </div>
            </div>

            <button
              onClick={getDirections}
              disabled={!request.from?.coordinates || !request.to?.coordinates}
              className="flex items-center gap-2 px-4 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#6a0000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Navigation className="h-4 w-4" />
              <span>Get Directions</span>
            </button>
          </div>


          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-[#800000]" />
            <div>
              <p className="text-sm text-gray-600">Distance (km)</p>
              <p className="font-medium">{request.distance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status and Documents */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#800000] mb-4">Status & Documents</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {request.status?.toLowerCase() === 'approved' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : request.status?.toLowerCase() === 'rejected' ? (
              <XCircle className="h-5 w-5 text-red-600" />
            ) : (
              <Timer className="h-5 w-5 text-yellow-600" />
            )}
            <div>
              <p className="text-sm text-gray-600">Request Status</p>
              <p className="font-medium">{request.status}</p>
            </div>
          </div>
          {request.status?.toLowerCase() === 'rejected' && request.rejectionReason && (
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Rejection Reason</p>
                <p className="font-medium">{request.rejectionReason}</p>
              </div>
            </div>
          )}
          {request.approvedBy && request.status?.toLowerCase() === 'approved' && (
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Approved By</p>
                <p className="font-medium">{request.approvedBy.name}</p>
              </div>
            </div>
          )}
          {request.rejectedBy && request.status?.toLowerCase() === 'rejected' && (
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Rejected By</p>
                <p className="font-medium">{request.rejectedBy.name}</p>
              </div>
            </div>
          )}
          {request.AssignedDriver && request.status?.toLowerCase() === 'approved' && (
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-[#800000]" />
              <div>
                <p className="text-sm text-gray-600">Assigned Driver</p>
                <p className="font-medium">{request.AssignedDriver.name} ({request.AssignedDriver.vehicle})</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#800000] via-gray-700 to-[#de9e28] mt-14">
      <div className="container mx-auto p-6">
        <button 
          onClick={onBack}
          className="flex items-center text-white mb-6 hover:text-[#de9e28] transition duration-300"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Requests
        </button>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#800000] to-[#de9e28] p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {request.request_type === 'VehicleRequest' ? request.full_name : request.visitor_name}
                </h1>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  <span className="text-white/80">Request #{request.id}</span>
                  <span className="text-white/80 bg-black/20 px-2 py-1 rounded">
                    {request.request_type === 'VehicleRequest' ? 'Vehicle Request' : 'Gate Pass'}
                  </span>
                </div>
              </div>
              {request.request_type === 'Gate Pass' && (
                <div className="flex items-center gap-2">
                  {request.is_regular_comer && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      Regular Visitor
                    </span>
                  )}
                  {request.consent && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Policy Agreed
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {request.request_type === 'Gate Pass' ? renderGatePassDetails() : renderVehicleRequestDetails()}
            </div>

            {/* Supporting Documents */}
            {request.supporting_documents && request.supporting_documents.data && (
              <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-[#800000] mb-4">Supporting Documents</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const byteArray = request.supporting_documents.data.data;
                    const mimeType = request.supporting_documents.contentType || 'application/octet-stream';
                    const blob = new Blob([new Uint8Array(byteArray)], { type: mimeType });
                    const blobUrl = URL.createObjectURL(blob);

                    return (
                      <div className="relative group">
                        {mimeType.startsWith('image/') ? (
                          <img
                            src={blobUrl}
                            alt="Supporting Document"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ) : (
                          <iframe
                            src={blobUrl}
                            title="Supporting Document"
                            className="w-full h-48 rounded-lg"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                          <a
                            href={blobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white text-sm hover:underline"
                          >
                            View Full Size
                          </a>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestDetails;